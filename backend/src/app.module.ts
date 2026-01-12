import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { ScraperModule } from './scraper/scraper.module';
import { ProductsController } from './products/products.controller';
import { CategoriesController } from './categories/categories.controller';
import { NavigationController } from './navigation/navigation.controller';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    ScraperModule,
  ],
  controllers: [
    ProductsController,
    CategoriesController,
    NavigationController,
    AppController,
  ],
  providers: [],
})
export class AppModule { }
