
import { Injectable, Logger } from '@nestjs/common';
import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { ScraperService } from '../scraper/scraper.service';

@Processor('scrape-queue')
@Injectable()
export class ScrapeProcessor extends WorkerHost {
    private readonly logger = new Logger(ScrapeProcessor.name);

    constructor(private readonly scraperService: ScraperService) {
        super();
    }

    async process(job: Job<any, any, string>): Promise<any> {
        this.logger.log(`Processing job ${job.id} of type ${job.name}`);

        switch (job.name) {
            case 'scrape-navigation':
                await this.scraperService.scrapeNavigation();
                break;
            case 'scrape-category':
                await this.scraperService.scrapeCategory(job.data.slug);
                break;
            case 'scrape-product':
                await this.scraperService.scrapeProduct(job.data.sourceId);
                break;
            default:
                this.logger.warn(`Unknown job type: ${job.name}`);
        }
    }

    @OnWorkerEvent('completed')
    onCompleted(job: Job) {
        this.logger.log(`Job ${job.id} completed`);
    }

    @OnWorkerEvent('failed')
    onFailed(job: Job, error: Error) {
        this.logger.error(`Job ${job.id} failed: ${error.message}`);
    }
}
