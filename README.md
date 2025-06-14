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

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation
- Review the code comments for implementation details

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**
