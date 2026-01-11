import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product } from '../database/schemas/product.schema';
import { ScraperService } from '../scraper/scraper.service';

@Controller('products')
export class ProductsController {
    constructor(
        @InjectModel(Product.name) private productModel: Model<Product>,
        private readonly scraperService: ScraperService,
    ) { }

    @Get()
    async findAll(
        @Query('limit') limit: number = 20,
        @Query('offset') offset: number = 0,
        @Query('categoryId') categoryId?: string,
    ) {
        const query = categoryId ? { categoryIds: new Types.ObjectId(categoryId) } : {};
        const [items, total] = await Promise.all([
            this.productModel
                .find(query)
                .limit(Number(limit))
                .skip(Number(offset))
                .populate('detail')
                .sort({ createdAt: -1 })
                .exec(),
            this.productModel.countDocuments(query).exec(),
        ]);

        return {
            items: items.map(p => ({ ...p.toObject(), id: p._id.toString() })),
            total
        };
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        const p = await this.productModel
            .findById(id)
            .populate('detail')
            .populate('reviews')
            .populate('categoryIds')
            .exec();

        if (!p) return null;
        const obj = p.toObject();
        return {
            ...obj,
            id: p._id.toString(),
            categories: obj.categoryIds
        };
    }

    @Post(':id/scrape')
    async triggerScrape(@Param('id') id: string) {
        const product = await this.productModel.findById(id).exec();
        if (!product) return { message: 'Product not found' };

        await this.scraperService.scrapeProduct(product.sourceId);
        return { message: 'Scrape started' };
    }
}
