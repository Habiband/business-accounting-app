# Project Structure

This document outlines the complete structure of the E-Commerce Full Stack Application.

## 📁 Root Directory

```
ecommerce-app/
├── backend/                 # Node.js/Express API server
├── frontend/                # Next.js React application
├── docker-compose.yml       # Docker orchestration
├── setup.sh                 # Unix setup script
├── setup.bat                # Windows setup script
├── start-dev.sh             # Unix development startup
├── start-dev.bat            # Windows development startup
├── README.md                # Main documentation
└── PROJECT_STRUCTURE.md     # This file
```

## 🔧 Backend Structure

```
backend/
├── src/
│   ├── config/              # Configuration files
│   │   ├── config.ts        # Environment configuration
│   │   ├── database.ts      # Database connection
│   │   └── logger.ts        # Winston logger setup
│   │
│   ├── controllers/         # Route controllers
│   │   ├── authController.ts
│   │   ├── productController.ts
│   │   ├── cartController.ts
│   │   ├── orderController.ts
│   │   ├── userController.ts
│   │   ├── categoryController.ts
│   │   ├── paymentController.ts
│   │   └── adminController.ts
│   │
│   ├── middleware/          # Express middleware
│   │   ├── auth.ts          # Authentication middleware
│   │   ├── errorHandler.ts  # Global error handling
│   │   ├── rateLimiter.ts   # Rate limiting
│   │   ├── upload.ts        # File upload handling
│   │   └── validation.ts    # Request validation
│   │
│   ├── routes/              # API routes
│   │   ├── auth.ts          # Authentication routes
│   │   ├── products.ts      # Product routes
│   │   ├── cart.ts          # Shopping cart routes
│   │   ├── orders.ts        # Order management routes
│   │   ├── users.ts         # User management routes
│   │   ├── categories.ts    # Category routes
│   │   ├── payments.ts      # Payment processing routes
│   │   └── admin.ts         # Admin routes
│   │
│   ├── utils/               # Utility functions
│   │   ├── AppError.ts      # Custom error class
│   │   ├── email.ts         # Email service
│   │   ├── jwt.ts           # JWT utilities
│   │   ├── validation.ts    # Validation schemas
│   │   └── helpers.ts       # General helpers
│   │
│   ├── validation/          # Joi validation schemas
│   │   ├── authValidation.ts
│   │   └── productValidation.ts
│   │
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts
│   │
│   ├── app.ts               # Express app setup
│   └── server.ts            # Server entry point
│
├── prisma/                  # Database schema and migrations
│   ├── schema.prisma        # Database schema
│   ├── seed.ts              # Database seeding
│   └── migrations/          # Database migrations
│
├── uploads/                 # File upload directory
├── tests/                   # Test files
├── .env.example             # Environment variables template
├── .gitignore               # Git ignore rules
├── .eslintrc.json           # ESLint configuration
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── jest.config.js           # Jest testing configuration
└── Dockerfile               # Docker container definition
```

## 🎨 Frontend Structure

```
frontend/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── auth/            # Authentication pages
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── products/        # Product pages
│   │   ├── cart/            # Shopping cart
│   │   ├── checkout/        # Checkout process
│   │   ├── orders/          # Order history
│   │   ├── profile/         # User profile
│   │   ├── admin/           # Admin dashboard
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Home page
│   │   ├── loading.tsx      # Loading UI
│   │   ├── error.tsx        # Error UI
│   │   └── not-found.tsx    # 404 page
│   │
│   ├── components/          # Reusable components
│   │   ├── ui/              # Basic UI components
│   │   │   ├── Button.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   └── Pagination.tsx
│   │   │
│   │   ├── layout/          # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── MobileMenu.tsx
│   │   │
│   │   ├── home/            # Home page components
│   │   │   ├── Hero.tsx
│   │   │   ├── FeaturedProducts.tsx
│   │   │   ├── Categories.tsx
│   │   │   ├── Features.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   └── Newsletter.tsx
│   │   │
│   │   ├── product/         # Product components
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductFilters.tsx
│   │   │   └── ProductSort.tsx
│   │   │
│   │   ├── cart/            # Cart components
│   │   │   └── CartDropdown.tsx
│   │   │
│   │   ├── user/            # User components
│   │   │   └── UserDropdown.tsx
│   │   │
│   │   └── providers/       # Context providers
│   │       └── Providers.tsx
│   │
│   ├── store/               # Zustand state management
│   │   ├── authStore.ts     # Authentication state
│   │   ├── cartStore.ts     # Shopping cart state
│   │   └── productStore.ts  # Product state
│   │
│   ├── lib/                 # Utility libraries
│   │   └── api.ts           # API client and endpoints
│   │
│   ├── hooks/               # Custom React hooks
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Utility functions
│   └── styles/              # Global styles
│       └── globals.css      # Global CSS with Tailwind
│
├── public/                  # Static assets
│   ├── images/              # Image assets
│   ├── icons/               # Icon files
│   ├── favicon.ico          # Favicon
│   └── manifest.json        # PWA manifest
│
├── .env.example             # Environment variables template
├── .env.local               # Local environment variables
├── .gitignore               # Git ignore rules
├── .eslintrc.json           # ESLint configuration
├── next.config.js           # Next.js configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS configuration
├── tsconfig.json            # TypeScript configuration
├── package.json             # Dependencies and scripts
└── Dockerfile               # Docker container definition
```

## 🗄️ Database Schema Overview

### Core Tables
- **users** - User accounts and authentication
- **products** - Product catalog
- **categories** - Product categorization
- **cart** - Shopping cart sessions
- **cart_items** - Items in shopping carts
- **orders** - Order records
- **order_items** - Items in orders
- **addresses** - User shipping/billing addresses

### Additional Tables
- **product_reviews** - Product ratings and reviews
- **coupons** - Discount codes and promotions
- **refresh_tokens** - JWT refresh token storage
- **product_images** - Product image management
- **inventory_logs** - Inventory change tracking

## 🔧 Configuration Files

### Backend Configuration
- **package.json** - Dependencies, scripts, and metadata
- **tsconfig.json** - TypeScript compiler options
- **.env** - Environment variables (not in repo)
- **.env.example** - Environment variables template
- **prisma/schema.prisma** - Database schema definition
- **jest.config.js** - Testing configuration

### Frontend Configuration
- **package.json** - Dependencies, scripts, and metadata
- **next.config.js** - Next.js framework configuration
- **tailwind.config.js** - Tailwind CSS customization
- **tsconfig.json** - TypeScript compiler options
- **.env.local** - Environment variables (not in repo)
- **.env.example** - Environment variables template

## 🚀 Key Features by Directory

### Authentication (`/auth`)
- User registration and login
- JWT token management
- Password reset functionality
- Email verification
- Role-based access control

### Product Management (`/products`)
- Product catalog with filtering
- Search functionality
- Category-based browsing
- Product reviews and ratings
- Inventory management

### Shopping Cart (`/cart`)
- Add/remove items
- Quantity management
- Persistent cart storage
- Real-time updates

### Order Processing (`/orders`)
- Order creation and tracking
- Payment integration
- Order history
- Status updates

### Admin Dashboard (`/admin`)
- Product management
- Order management
- User management
- Analytics and reporting

## 📱 Mobile-First Design

The application is built with a mobile-first approach:
- Responsive design using Tailwind CSS
- Touch-friendly interfaces
- Optimized for various screen sizes
- PWA-ready for mobile app-like experience

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- Input validation and sanitization
- CORS protection
- Helmet.js security headers
- SQL injection prevention with Prisma ORM

## 🧪 Testing Structure

```
tests/
├── backend/
│   ├── unit/               # Unit tests
│   ├── integration/        # Integration tests
│   └── e2e/               # End-to-end tests
└── frontend/
    ├── components/         # Component tests
    ├── pages/             # Page tests
    └── utils/             # Utility tests
```

This structure provides a solid foundation for a scalable, maintainable e-commerce application with modern development practices and comprehensive functionality.
