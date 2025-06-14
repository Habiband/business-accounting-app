<<<<<<< HEAD
# E-Commerce Full Stack Application

A modern, full-stack e-commerce application built with Next.js, Node.js, TypeScript, and PostgreSQL. Features a complete shopping experience with user authentication, product management, shopping cart, order processing, and payment integration.

## 🚀 Features

### Frontend (Next.js 14)
- **Modern UI/UX**: Responsive design with Tailwind CSS and dark mode support
- **Product Catalog**: Advanced filtering, sorting, and search functionality
- **Shopping Cart**: Real-time cart management with persistent storage
- **User Authentication**: Secure login/register with JWT tokens
- **Order Management**: Complete order history and tracking
- **Payment Integration**: Stripe and PayPal payment processing
- **Admin Dashboard**: Product and order management interface
- **Mobile-First**: Optimized for mobile devices and PWA-ready

### Backend (Node.js + Express)
- **RESTful API**: Well-structured API with comprehensive endpoints
- **Authentication**: JWT-based auth with refresh tokens
- **Database**: PostgreSQL with Prisma ORM
- **File Upload**: Image handling with Sharp for optimization
- **Email Service**: Automated emails for orders and notifications
- **Payment Processing**: Stripe and PayPal integration
- **Security**: Rate limiting, CORS, helmet, and input validation
- **Logging**: Comprehensive logging with Winston

### Database Schema
- Users with role-based access control
- Products with categories, variants, and inventory management
- Shopping cart with persistent storage
- Orders with detailed tracking and status updates
- Reviews and ratings system
- Coupon and discount management

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios with interceptors
- **Forms**: React Hook Form with Zod validation
- **UI Components**: Headless UI
- **Icons**: Heroicons
- **Notifications**: React Hot Toast

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT
- **Validation**: Joi
- **File Upload**: Multer + Sharp
- **Email**: Nodemailer
- **Payments**: Stripe SDK
- **Logging**: Winston
- **Security**: Helmet, CORS, Rate Limiting

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL 12+
- npm or yarn
- Git

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ecommerce-app
```

### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your database and service credentials
# DATABASE_URL="postgresql://username:password@localhost:5432/ecommerce_db"
# JWT_SECRET="your-super-secret-jwt-key"
# STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
# EMAIL_USER="your-email@gmail.com"
# EMAIL_PASS="your-app-password"

# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed the database with sample data
npm run db:seed

# Start the development server
npm run dev
```

The backend will be running at `http://localhost:5000`

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Edit .env.local with your configuration
# NEXT_PUBLIC_API_URL=http://localhost:5000/api
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Start the development server
npm run dev
```

The frontend will be running at `http://localhost:3000`

## 🔧 Environment Variables

### Backend (.env)
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/ecommerce_db"

# JWT
JWT_SECRET="your-super-secret-jwt-key"
JWT_REFRESH_SECRET="your-super-secret-refresh-key"

# Server
PORT=5000
NODE_ENV="development"
CORS_ORIGIN="http://localhost:3000"

# Email
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"

# Stripe
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"

# Security
BCRYPT_ROUNDS=12
COOKIE_SECRET="your-cookie-secret"
```

### Frontend (.env.local)
```env
# API
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📊 Database Setup

### Using Docker (Recommended)
```bash
# Start PostgreSQL with Docker
docker run --name ecommerce-postgres \
  -e POSTGRES_DB=ecommerce_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -d postgres:15

# Update your DATABASE_URL in .env
DATABASE_URL="postgresql://postgres:password@localhost:5432/ecommerce_db"
```

### Manual PostgreSQL Setup
1. Install PostgreSQL
2. Create a database: `createdb ecommerce_db`
3. Update the `DATABASE_URL` in your `.env` file

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
npm run test:coverage
```

### Frontend Tests
```bash
cd frontend
npm test
npm run test:coverage
```

## 📦 Production Deployment

### Backend Deployment
```bash
cd backend

# Build the application
npm run build

# Start production server
npm start
```

### Frontend Deployment
```bash
cd frontend

# Build the application
npm run build

# Start production server
npm start
```

## 🔐 Default Accounts

After running the seed script, you can use these accounts:

**Admin Account:**
- Email: `admin@ecommerce.com`
- Password: `Admin123!`

**Customer Account:**
- Email: `customer@example.com`
- Password: `Customer123!`

## 📱 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh-token` - Refresh access token

### Product Endpoints
- `GET /api/products` - Get all products (with filtering)
- `GET /api/products/:id` - Get single product
- `GET /api/products/search` - Search products
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)

### Cart Endpoints
- `GET /api/cart` - Get user's cart
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/:id` - Update cart item
- `DELETE /api/cart/items/:id` - Remove item from cart

### Order Endpoints
- `GET /api/orders` - Get user's orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get single order

## 🎨 Customization

### Styling
- Modify `frontend/tailwind.config.js` for theme customization
- Update `frontend/src/styles/globals.css` for global styles
- Colors and design tokens are defined in the Tailwind config

### Features
- Add new API endpoints in `backend/src/routes/`
- Create new pages in `frontend/src/app/`
- Extend the database schema in `backend/prisma/schema.prisma`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page
2. Create a new issue with detailed information
3. Include error logs and environment details

## 🔄 Updates

To update the application:

```bash
# Pull latest changes
git pull origin main

# Update backend dependencies
cd backend && npm install

# Update frontend dependencies
cd frontend && npm install

# Run any new migrations
cd backend && npm run db:migrate
```

---

**Happy coding! 🚀** Application

A comprehensive, production-ready e-commerce web application built with modern technologies, designed for easy conversion to mobile applications.

## 🏗️ Architecture

- **Backend**: Node.js + Express + TypeScript + Prisma + PostgreSQL
- **Frontend**: Next.js 14 + React + TypeScript + Tailwind CSS + Zustand
- **Database**: PostgreSQL with Redis for caching
- **Authentication**: JWT with secure implementation
- **Payments**: Stripe + PayPal integration
- **Mobile Ready**: PWA + Capacitor ready structure

## 🚀 Features

### Core E-commerce
- ✅ User authentication (login, register, password reset)
- ✅ Product catalog with categories, filters, and search
- ✅ Product details with images, variants, and reviews
- ✅ Shopping cart functionality
- ✅ Checkout process with multiple payment gateways
- ✅ Order history and tracking
- ✅ Admin dashboard for product/order management
- ✅ Recommendation engine
- ✅ Wishlist functionality
- ✅ Customer support chat

### Technical Features
- ✅ SEO optimized structure
- ✅ Performance optimized (code splitting, lazy loading)
- ✅ Accessibility compliant (WCAG 2.1 AA)
- ✅ Internationalization support (i18n)
- ✅ Analytics integration
- ✅ Comprehensive logging system
- ✅ Rate limiting and security headers
- ✅ Data validation and sanitization

## 📱 Mobile App Conversion Ready

The codebase is structured to support easy conversion to:
- **Capacitor-based Android/iOS apps**
- **Flutter mobile applications**
- **Progressive Web App (PWA)**

## 🛠️ Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis (optional, for caching)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd ecommerce-app
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

4. Set up the database
```bash
cd backend
npx prisma migrate dev
npx prisma db seed
```

5. Start development servers
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📚 Documentation

- [Setup Guide](./docs/setup.md)
- [API Documentation](./docs/api.md)
- [Deployment Guide](./docs/deployment.md)
- [Mobile Conversion Guide](./docs/mobile-conversion.md)
- [Testing Strategy](./docs/testing.md)

## 🧪 Testing

```bash
# Run all tests
npm test

# Run backend tests
npm run test --workspace=backend

# Run frontend tests
npm run test --workspace=frontend
```

## 🚀 Deployment

See [Deployment Guide](./docs/deployment.md) for detailed instructions on deploying to various platforms.

## 📱 Mobile App Conversion

See [Mobile Conversion Guide](./docs/mobile-conversion.md) for instructions on converting to mobile applications.
=======
# Business Accounting & Sales Management Web Application

A comprehensive, multi-user, role-based accounting and sales management web application built with Next.js 15, TypeScript, and Tailwind CSS.

## 🚀 Features

### Core Functionality
- **Multi-user Authentication System** with role-based access control
- **Real-time Dashboard** with financial metrics and analytics
- **Transaction Management** for income and expense tracking
- **Financial Reporting** with comprehensive P&L statements
- **User Management** for administrators
- **Profile Management** with security settings

### User Roles
- **Admin**: Full system access, user management, all reports
- **Accountant**: Access to all financial data, transaction approval
- **Employee**: Can create transactions, view own data
- **Shareholder**: Read-only access to financial summaries

### Key Pages
1. **Dashboard** (`/`) - Overview of financial metrics and quick actions
2. **Transactions** (`/transactions`) - Manage income and expense transactions
3. **Reports** (`/reports`) - Comprehensive financial reporting
4. **Users** (`/users`) - User management (Admin only)
5. **Profile** (`/profile`) - Personal account management
6. **Authentication** (`/auth/signin`, `/auth/signup`) - Login and registration

## 🛠️ Technology Stack

- **Frontend**: Next.js 15 with App Router, TypeScript, Tailwind CSS
- **Authentication**: Custom context-based auth system (ready for Supabase integration)
- **UI Components**: Custom components with Tailwind CSS
- **State Management**: React Context API
- **Development**: Turbopack for fast development builds

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd business-accounting-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   Update the environment variables in `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Default Login Credentials

For testing purposes, use these credentials:
- **Email**: admin@example.com
- **Password**: password
- **Role**: Admin (full access)

## 📁 Project Structure

```
business-accounting-app/
├── app/                          # Next.js App Router pages
│   ├── auth/                     # Authentication pages
│   │   ├── signin/page.tsx       # Sign in page
│   │   └── signup/page.tsx       # Sign up page
│   ├── transactions/page.tsx     # Transaction management
│   ├── reports/page.tsx          # Financial reports
│   ├── users/page.tsx           # User management
│   ├── profile/page.tsx         # User profile
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Dashboard
│   └── globals.css              # Global styles
├── src/
│   ├── components/ui/           # Reusable UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── input.tsx
│   ├── contexts/                # React contexts
│   │   └── AuthContext.tsx     # Authentication context
│   └── lib/                     # Utility functions
│       ├── supabase.ts          # Supabase client
│       └── utils.ts             # Helper functions
├── database/
│   └── schema.sql               # Database schema for Supabase
├── public/                      # Static assets
└── package.json                 # Dependencies and scripts
```

## 🗄️ Database Schema

The application includes a complete SQL schema (`database/schema.sql`) with:
- User profiles with role-based permissions
- Transaction management with approval workflows
- Category management for income/expense classification
- Audit logging for all changes
- File upload tracking
- Row Level Security (RLS) policies

## 🔧 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern Interface**: Clean, professional design with Tailwind CSS
- **Accessibility**: Semantic HTML and keyboard navigation
- **Loading States**: Smooth transitions and loading indicators
- **Error Handling**: User-friendly error messages
- **Dark Mode Ready**: CSS variables for easy theme switching

## 🔒 Security Features

- **Role-based Access Control**: Different permissions for each user role
- **Input Validation**: Client and server-side validation
- **XSS Protection**: Sanitized inputs and outputs
- **CSRF Protection**: Built-in Next.js protections
- **Secure Authentication**: Password hashing and session management

## 📊 Business Features

### Financial Management
- Income and expense tracking
- Category-based organization
- Approval workflows for transactions
- Real-time financial metrics
- Profit & Loss statements
- Cash flow analysis

### Reporting
- Monthly, quarterly, and yearly reports
- Category breakdown analysis
- Revenue vs expense comparisons
- Export to PDF and Excel
- Custom date range filtering

### User Management
- Role assignment and permissions
- Department organization
- User activity tracking
- Account status management

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
- **Netlify**: Configure build settings for Next.js
- **Railway**: Use the provided Dockerfile
- **AWS/GCP**: Deploy using container services

## 🔄 Future Enhancements

- **Real-time Collaboration**: WebSocket integration for live updates
- **Advanced Analytics**: Machine learning insights
- **Mobile App**: React Native companion app
- **API Integration**: Connect with accounting software
- **Automated Backups**: Scheduled data backups
- **Multi-currency Support**: International business support
- **OCR Integration**: Automatic receipt text extraction
- **Workflow Automation**: Custom approval processes
>>>>>>> 9031239bfd06bf14d71914cbcad4ea20867396b2

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
<<<<<<< HEAD
4. Add tests
=======
4. Add tests if applicable
>>>>>>> 9031239bfd06bf14d71914cbcad4ea20867396b2
5. Submit a pull request

## 📄 License

<<<<<<< HEAD
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
=======
This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation
- Review the code comments for implementation details

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**
>>>>>>> 9031239bfd06bf14d71914cbcad4ea20867396b2
