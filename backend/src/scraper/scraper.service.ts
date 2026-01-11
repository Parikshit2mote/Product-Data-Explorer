
import { Injectable, Logger } from '@nestjs/common';
import { PlaywrightCrawler } from 'crawlee';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Navigation } from '../database/schemas/navigation.schema';
import { Category } from '../database/schemas/category.schema';
import { Product } from '../database/schemas/product.schema';
import { ProductDetail } from '../database/schemas/product-detail.schema';

@Injectable()
export class ScraperService {
    private readonly logger = new Logger(ScraperService.name);

    constructor(
        @InjectModel(Navigation.name) private navigationModel: Model<Navigation>,
        @InjectModel(Category.name) private categoryModel: Model<Category>,
        @InjectModel(Product.name) private productModel: Model<Product>,
        @InjectModel(ProductDetail.name) private detailModel: Model<ProductDetail>,
    ) { }

    async scrapeNavigation() {
        const { chromium } = require('playwright');
        const browser = await chromium.launch({ headless: true });
        const page = await browser.newPage();

        try {
            console.log('Starting direct navigation scrape...');
            await page.goto('https://www.worldofbooks.com/en-gb/', { waitUntil: 'networkidle' });

            const navItems = await page.$$eval('a', (links) => {
                return links
                    .filter(link => link.getAttribute('href')?.includes('/collections/'))
                    .map((link) => {
                        const url = link.getAttribute('href') || '';
                        const parts = url.split('/').filter(Boolean);
                        return {
                            title: link.textContent?.trim() || '',
                            slug: parts.pop() || '',
                            url: url,
                        };
                    })
                    .filter((item) => item.title && item.slug && item.title.length < 30);
            });

            const uniqueItems: any[] = Array.from(new Map(navItems.map((item: any) => [item.slug, item])).values());
            console.log(`Found ${uniqueItems.length} unique navigation items`);

            for (const item of uniqueItems) {
                const nav: any = await this.navigationModel.findOneAndUpdate(
                    { slug: item.slug },
                    { title: item.title, lastScrapedAt: new Date() },
                    { upsert: true, new: true },
                );

                await this.categoryModel.findOneAndUpdate(
                    { slug: item.slug },
                    {
                        title: item.title,
                        navigationId: nav._id,
                        lastScrapedAt: new Date()
                    },
                    { upsert: true }
                );
            }
        } finally {
            await browser.close();
        }
    }

    async scrapeCategory(slug: string) {
        const { chromium } = require('playwright');
        const browser = await chromium.launch({ headless: true });
        const page = await browser.newPage();
        const url = `https://www.worldofbooks.com/en-gb/collections/${slug}`;

        try {
            console.log(`Starting direct category scrape for ${slug}...`);
            await page.goto(url, { waitUntil: 'networkidle' });

            // Target the parent container that has both link and image
            const products = await page.$$eval('li.grid__item', (items) => {
                return items.map((item) => {
                    // Find the product link
                    const link = item.querySelector('a.product-card, .product-card');
                    if (!link) return null;

                    // Title from data attribute or inner text
                    const title = link.getAttribute('data-item_name') || link.textContent?.trim() || '';

                    // Price from data attribute
                    const priceText = link.getAttribute('data-price') || '0';
                    const price = parseFloat(priceText) || 0;

                    // Image from img tag in the container
                    const imgEl = item.querySelector('img');
                    const imageUrl = imgEl?.getAttribute('src') || imgEl?.getAttribute('data-src') || '';

                    // URL and ID from link
                    const sourceUrl = link.getAttribute('href') || '';
                    const sourceId = link.getAttribute('data-item_ean') || sourceUrl.split('/').filter(Boolean).pop() || '';

                    return { title, price, imageUrl, sourceUrl, sourceId };
                }).filter(p => p !== null && p.title && p.sourceId); // Filter out nulls and invalid items
            });

            console.log(`Found ${products.length} products`);

            const category = await this.categoryModel.findOne({ slug }).exec();
            if (!category) return;

            for (const p of products as any[]) {
                const product: any = await this.productModel.findOneAndUpdate(
                    { sourceId: p.sourceId },
                    {
                        title: p.title,
                        price: p.price,
                        imageUrl: p.imageUrl,
                        sourceUrl: `https://www.worldofbooks.com${p.sourceUrl}`,
                        $addToSet: { categoryIds: category._id },
                        lastScrapedAt: new Date(),
                    },
                    { upsert: true, new: true },
                );

                await this.categoryModel.findByIdAndUpdate(category._id, {
                    $addToSet: { productIds: product._id },
                });
            }
        } finally {
            await browser.close();
        }
    }

    async scrapeProduct(sourceId: string) {
        const { chromium } = require('playwright');
        const browser = await chromium.launch({ headless: true });
        const page = await browser.newPage();
        const url = `https://www.worldofbooks.com/en-gb/products/${sourceId}`;

        try {
            console.log(`Starting direct product scrape for ${sourceId}...`);
            await page.goto(url, { waitUntil: 'networkidle' });

            // Better description selector
            const description = await page.$eval('.rich-text__text.rte, .product-description, .description', (el) => el.innerHTML).catch(() => 'No description available');

            // Try to find specs/details
            const specs = await page.$$eval('.product-details__table tr, .specs-table tr', (rows) => {
                const res: Record<string, string> = {};
                rows.forEach(row => {
                    const label = row.querySelector('th, td:first-child')?.textContent?.trim() || '';
                    const value = row.querySelector('td:last-child')?.textContent?.trim() || '';
                    if (label && value) res[label] = value;
                });
                return res;
            }).catch(() => ({}));

            // Related products
            const relatedIds = await page.$$eval('.product-card', (cards) => {
                return cards
                    .map(card => {
                        const href = card.tagName === 'A' ? card.getAttribute('href') : card.querySelector('a')?.getAttribute('href') || '';
                        return href.split('/').filter(Boolean).pop() || '';
                    })
                    .filter(id => id && id.length > 5); // Avoid small garbage
            }).catch(() => []);

            const product = await this.productModel.findOne({ sourceId }).exec();
            if (!product) return;

            await this.detailModel.findOneAndUpdate(
                { productId: product._id },
                {
                    description,
                    specs,
                    relatedIds: [...new Set(relatedIds)],
                    lastScrapedAt: new Date()
                },
                { upsert: true },
            );
        } finally {
            await browser.close();
        }
    }
}
