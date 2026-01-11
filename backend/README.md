# Backend - Product Data Explorer API

NestJS backend service for the Product Data Explorer platform. Provides RESTful APIs and web scraping capabilities for World of Books product data.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB running locally or connection string to MongoDB Atlas
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Install Playwright browsers (required for scraping)
npx playwright install chromium
```

### Configuration

Create a `.env` file from the example:
```bash
cp .env.example .env
```

Edit `.env` and configure:
```env
DATABASE_URL=mongodb://localhost:27017/product_explorer
PORT=4000
NODE_ENV=development
```

### Running the Application

**Development Mode (with hot reload):**
```bash
npm run start:dev
```

**Production Mode:**
```bash
npm run build
npm run start:prod
```

**Debug Mode:**
```bash
npm run start:debug
```

The API will be available at `http://localhost:4000`

## 📁 Project Structure

```
backend/
├── src/
│   ├── app.module.ts           # Root application module
│   ├── main.ts                 # Application entry point
│   ├── navigation/             # Navigation endpoints
│   │   ├── navigation.controller.ts
│   │   └── navigation.module.ts
│   ├── categories/             # Category endpoints
│   │   ├── categories.controller.ts
│   │   └── categories.module.ts
│   ├── products/               # Product endpoints
│   │   ├── products.controller.ts
│   │   └── products.module.ts
│   ├── scraper/                # Web scraping service
│   │   ├── scraper.service.ts
│   │   └── scraper.module.ts
│   └── database/               # MongoDB schemas
│       ├── database.module.ts
│       └── schemas/
│           ├── navigation.schema.ts
│           ├── category.schema.ts
│           ├── product.schema.ts
│           ├── product-detail.schema.ts
│           └── review.schema.ts
├── test/                       # E2E tests
├── package.json
└── tsconfig.json
```

## 🔌 API Documentation

### Navigation Endpoints

#### GET /navigation
Get all navigation items.

**Response:**
```json
[
  {
    "id": "6963700cd0c95eaa02e0e0dd",
    "title": "Modern Fiction",
    "slug": "modern-fiction-books",
    "lastScrapedAt": "2026-01-11T09:40:28.184Z"
  }
]
```

#### POST /navigation/scrape
Trigger scraping of navigation items from World of Books homepage.

**Response:**
```json
{
  "message": "Navigation scrape started"
}
```

### Category Endpoints

#### GET /categories
Get all categories.

#### GET /categories/:slug
Get a specific category by slug.

**Response:**
```json
{
  "id": "6963700cd0c95eaa02e0e0dd",
  "title": "Modern Fiction",
  "slug": "modern-fiction-books",
  "navigationId": "...",
  "productCount": 40
}
```

#### POST /categories/:slug/scrape
Trigger product scraping for a specific category.

### Product Endpoints

#### GET /products
Get products with optional filters.

**Query Parameters:**
- `categoryId` - Filter by category ID
- `limit` - Number of products per page (default: 20)
- `offset` - Pagination offset (default: 0)

**Response:**
```json
{
  "items": [
    {
      "id": "6963b348d0c95eaa02e0fe0b",
      "title": "All the Light We Cannot See",
      "price": 3.7,
      "currency": "GBP",
      "imageUrl": "https://...",
      "sourceUrl": "https://www.worldofbooks.com/...",
      "sourceId": "9780008138301"
    }
  ],
  "total": 40
}
```

#### GET /products/:id
Get detailed product information.

#### POST /products/:id/scrape
Trigger detailed scraping for a specific product (fetches description, specs, related products).

## 🕷️ Web Scraping

The scraper uses Playwright to extract data from World of Books:

### Navigation Scraping
- Targets: `https://www.worldofbooks.com/en-gb/`
- Extracts: All links containing `/collections/`
- Duration: ~30-60 seconds
- Saves: ~146 navigation items + categories

### Category Scraping
- Targets: `https://www.worldofbooks.com/en-gb/collections/{slug}`
- Selector: `li.grid__item` (contains product cards and images)
- Extracts: Title, price, image, sourceUrl, EAN
- Duration: ~20-30 seconds
- Saves: ~40 products per category

### Product Detail Scraping
- Targets: Individual product pages
- Extracts: Description (`.rich-text__text.rte`), specs, related products
- Duration: ~10-15 seconds
- Saves: Full product details

### Ethical Scraping Practices

✅ Respectful delays between requests  
✅ Headless browser to appear as regular traffic  
✅ Caches results to minimize repeat requests  
✅ On-demand only (no auto-scraping)  
✅ Tracks lastScrapedAt timestamps  

## 🗄️ Database

### MongoDB Collections

**navigations**
```typescript
{
  _id: ObjectId
  title: string
  slug: string (unique)
  lastScrapedAt: Date
  createdAt: Date
  updatedAt: Date
}
```

**categories**
```typescript
{
  _id: ObjectId
  title: string
  slug: string (unique)
  navigationId: ObjectId (ref: Navigation)
  productIds: ObjectId[] (ref: Product)
  lastScrapedAt: Date
}
```

**products**
```typescript
{
  _id: ObjectId
  sourceId: string (unique, indexed)
  title: string
  price: number
  currency: string (default: 'GBP')
  imageUrl: string
  sourceUrl: string (unique)
  categoryIds: ObjectId[] (ref: Category)
  lastScrapedAt: Date
}
```

**productdetails**
```typescript
{
  _id: ObjectId
  productId: ObjectId (ref: Product, unique)
  description: string (HTML)
  specs: object
  relatedIds: string[] (sourceIds)
  lastScrapedAt: Date
}
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 🔧 Scripts

```bash
npm run start:dev    # Development with hot reload
npm run start:prod   # Production mode
npm run build        # Build for production
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

## 🐛 Troubleshooting

**MongoDB Connection Errors:**
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`
- For MongoDB Atlas, whitelist your IP

**Playwright Issues:**
- Run: `npx playwright install`
- On Windows, may need to run as Administrator

**Port Already in Use:**
- Change PORT in `.env`
- Kill existing process: `npx kill-port 4000`

## 📦 Dependencies

### Core
- `@nestjs/common` - NestJS framework
- `@nestjs/mongoose` - MongoDB integration
- `mongoose` - ODM for MongoDB
- `playwright` - Headless browser automation

### Validation & Transform
- `class-validator` - DTO validation
- `class-transformer` - Object transformation

## 🚀 Deployment

### Docker
```bash
docker build -t product-explorer-api .
docker run -p 4000:4000 --env-file .env product-explorer-api
```

### Manual Deployment (Render, Railway, etc.)
1. Push code to GitHub
2. Connect repository to hosting platform
3. Set environment variables (DATABASE_URL, PORT)
4. Run build command: `npm run build`
5. Run start command: `npm run start:prod`

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | MongoDB connection string | `mongodb://localhost:27017/product_explorer` |
| `PORT` | Server port | `4000` |
| `NODE_ENV` | Environment | `development` |

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests: `npm run test`
4. Lint code: `npm run lint`
5. Submit a pull request

## 📄 License

MIT
