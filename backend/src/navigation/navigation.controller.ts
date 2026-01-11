import { Controller, Get, Post } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Navigation } from '../database/schemas/navigation.schema';
import { ScraperService } from '../scraper/scraper.service';

@Controller('navigation')
export class NavigationController {
    constructor(
        @InjectModel(Navigation.name) private navigationModel: Model<Navigation>,
        private readonly scraperService: ScraperService,
    ) { }

    @Get()
    async findAll() {
        const navs = await this.navigationModel.find().exec();
        return navs.map(n => ({
            ...n.toObject(),
            id: n._id.toString()
        }));
    }

    @Post('scrape')
    async triggerScrape() {
        await this.scraperService.scrapeNavigation();
        return { message: 'Navigation scrape started' };
    }
}
