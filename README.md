# Product Data Explorer

A full-stack product exploration platform that scrapes and displays product data from World of Books with on-demand live scraping capabilities.

## 🚀 Live Demo

- **Frontend**: [Deployment URL to be added]
- **Backend API**: [Deployment URL to be added]
- **API Docs**: [Swagger/API docs URL to be added]

## 📋 Features

✅ **Landing loads navigation headings** - 146+ categories from World of Books  
✅ **Category drilldown** - Navigate through categories and subcategories  
✅ **Product grid** - Real products with images, titles, and prices  
✅ **Product detail pages** - Full descriptions, specs, and related products  
✅ **On-demand scraping** - Live data fetching with user-triggered scrapes  
✅ **Responsive design** - Mobile-first UI with Tailwind CSS  
✅ **Database persistence** - MongoDB with Mongoose ODM  

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 14 (React 18, App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Data Fetching**: TanStack Query (React Query)
- **Animations**: Framer Motion
- **HTTP Client**: Axios

### Backend
- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Web Scraping**: Playwright (headless browser)
- **Validation**: class-validator, class-transformer

## 📁 Project Structure

```
Product Data Explorer/
├── frontend/              # Next.js frontend application
│   ├── src/
│   │   ├── app/          # App router pages
│   │   └── lib/          # Utilities (API client, etc.)
│   ├── package.json
│   └── README.md
├── backend/              # NestJS backend application
│   ├── src/
│   │   ├── navigation/   # Navigation endpoints
│   │   ├── categories/   # Category endpoints
│   │   ├── products/     # Product endpoints
│   │   ├── scraper/      # Scraping logic
│   │   └── database/     # MongoDB schemas
│   ├── package.json
│   └── README.md
└── README.md            # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or cloud instance)

### Installation

1. **Clone the repository**
```bash
git clone [your-repo-url]
cd "Product Data Explorer"
```

2. **Install Backend Dependencies**
```bash
cd backend
npm install
npx playwright install chromium
```

3. **Configure Backend Environment**
```bash
cp .env.example .env
# Edit .env and set your MongoDB connection string
```

4. **Install Frontend Dependencies**
```bash
cd ../frontend
npm install
```

5. **Configure Frontend Environment**
```bash
cp .env.example .env
# Edit .env and set the backend API URL
```

### Running Locally

**Terminal 1 - Backend:**
```bash
cd backend
npm run start:dev
# Backend runs on http://localhost:4000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:3000
```

**Terminal 3 - MongoDB (if running locally):**
```bash
mongod
```

### First Time Setup

1. Open http://localhost:3000
2. Click "Trigger Sync" to scrape navigation items (takes ~60 seconds)
3. Navigate to Categories page
4. Click on any category and click "On-Demand Scrape" to fetch products

## 📊 Database Schema

### Collections

- **navigations** - Top-level navigation items (146 items from WOB)
- **categories** - Product categories linked to navigations
- **products** - Product listings with prices and images
- **productdetails** - Detailed product information and specs
- **reviews** - Product reviews (schema ready)
- **scrapejobs** - Job tracking (schema ready)
- **viewhistories** - User browsing history (schema ready)

### Key Relationships

```
Navigation (1) ──> (many) Categories
Category (1) ──> (many) Products  
Product (1) ──> (1) ProductDetail
Product (1) ──> (many) Reviews
```

## 🔌 API Endpoints

### Navigation
- `GET /navigation` - Get all navigation items
- `POST /navigation/scrape` - Trigger navigation scrape

### Categories
- `GET /categories` - Get all categories
- `GET /categories/:slug` - Get category by slug
- `POST /categories/:slug/scrape` - Scrape products for category

### Products
- `GET /products` - Get products (supports ?categoryId, ?limit, ?offset)
- `GET /products/:id` - Get product details
- `POST /products/:id/scrape` - Scrape full product details

## 🎨 Frontend Pages

- `/` - Home page with navigation headings
- `/categories` - All categories grid
- `/categories/:slug` - Category detail with products
- `/products/:id` - Product detail page
- `/about` - About page

## 🧪 Testing

### Run Backend Tests
```bash
cd backend
npm run test
```

### Run Frontend Tests
```bash
cd frontend
npm run test
```

## 📦 Build for Production

### Backend
```bash
cd backend
npm run build
npm run start:prod
```

### Frontend
```bash
cd frontend
npm run build
npm start
```

## 🔧 Environment Variables

### Backend (.env)
```
DATABASE_URL=mongodb://localhost:27017/product_explorer
PORT=4000
```

### Frontend (.env)
```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## 🚢 Deployment

### Option 1: Vercel (Frontend) + Render (Backend)
1. Deploy backend to Render
2. Deploy frontend to Vercel
3. Set environment variables in each platform

### Option 2: Docker Compose
```bash
docker-compose up -d
```

## 📝 Design Decisions

1. **MongoDB over PostgreSQL**: Flexible schema for evolving scraping requirements
2. **Direct Playwright over Crawlee**: Windows compatibility and simpler error handling
3. **On-demand scraping**: Avoids overloading World of Books servers
4. **React Query**: Automatic caching and background refetching
5. **Removed Redis/BullMQ**: Simplified architecture for assignment scope

## ⚠️ Known Limitations

- No authentication system (out of scope)
- Product reviews not populated (WOB doesn't show per-product reviews)
- Single collection page loads 40 products (pagination ready but not implemented)
- No search functionality yet

## 🤝 Contributing

This is an internship assignment project. For questions, contact [your email].

## 📄 License

MIT License - feel free to use for learning purposes.

## 🙏 Acknowledgments

- World of Books for the product data source
- NestJS and Next.js communities for excellent documentation
