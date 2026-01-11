
import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Navigation, NavigationSchema } from './schemas/navigation.schema';
import { Category, CategorySchema } from './schemas/category.schema';
import { Product, ProductSchema } from './schemas/product.schema';
import { ProductDetail, ProductDetailSchema } from './schemas/product-detail.schema';
import { Review, ReviewSchema } from './schemas/review.schema';
import { ScrapeJob, ScrapeJobSchema } from './schemas/scrape-job.schema';
import { ViewHistory, ViewHistorySchema } from './schemas/view-history.schema';

@Global()
@Module({
    imports: [
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get<string>('DATABASE_URL'),
            }),
            inject: [ConfigService],
        }),
        MongooseModule.forFeature([
            { name: Navigation.name, schema: NavigationSchema },
            { name: Category.name, schema: CategorySchema },
            { name: Product.name, schema: ProductSchema },
            { name: ProductDetail.name, schema: ProductDetailSchema },
            { name: Review.name, schema: ReviewSchema },
            { name: ScrapeJob.name, schema: ScrapeJobSchema },
            { name: ViewHistory.name, schema: ViewHistorySchema },
        ]),
    ],
    exports: [MongooseModule],
})
export class DatabaseModule { }
