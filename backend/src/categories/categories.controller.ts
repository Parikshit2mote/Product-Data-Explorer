import { Controller, Get, Param, Post } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from '../database/schemas/category.schema';
import { ScraperService } from '../scraper/scraper.service';

@Controller('categories')
export class CategoriesController {
    constructor(
        @InjectModel(Category.name) private categoryModel: Model<Category>,
        private readonly scraperService: ScraperService,
    ) { }

    @Get()
    async findAll() {
        const categories = await this.categoryModel.find().populate('subCategories').exec();
        return categories.map(cat => ({
            ...cat.toObject(),
            id: cat._id.toString(),
            productCount: (cat as any).productIds?.length || 0
        }));
    }

    @Get(':slug')
    async findBySlug(@Param('slug') slug: string) {
        const cat = await this.categoryModel.findOne({ slug }).populate('subCategories').exec();
        if (!cat) return null;
        return {
            ...cat.toObject(),
            id: cat._id.toString(),
            productCount: (cat as any).productIds?.length || 0
        };
    }

    @Post(':slug/scrape')
    async triggerScrape(@Param('slug') slug: string) {
        await this.scraperService.scrapeCategory(slug);
        return { message: 'Category scrape started' };
    }
}
