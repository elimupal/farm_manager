# 🌾 Farm Management System

A modern, full-stack farm management system built with Next.js 15, showcasing cutting-edge web development practices and technologies.

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v5
- **Validation**: Zod
- **State Management**: Zustand
- **Forms**: React Hook Form
- **UI Components**: shadcn/ui
- **Styling**: TailwindCSS
- **Icons**: Lucide React

## ✨ Features

### ✅ Implemented (MVP)

- **Authentication System**
  - User registration and login
  - JWT-based sessions
  - Password hashing with bcrypt
  - Role-based access (Owner, Manager, Supervisor, Worker, Agronomist)
  - Protected routes with middleware

- **Dashboard**
  - Real-time statistics
  - Collapsible sidebar navigation
  - User profile menu
  - Responsive design

- **Fields Management**
  - Create, read, update, delete fields
  - Multiple field types (greenhouse, open field, screenhouse, etc.)
  - Track area, soil type, irrigation
  - Status management (active, fallow, under preparation)

### 🚧 Planned Features

- Crops & Planting Management
- Inventory Tracking (agrochemicals, fertilizers, seeds)
- Employee Management
- Activity Logging
- Analytics & Reports

## 🏗️ Project Structure

```
farm_manager/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Protected dashboard pages
│   └── api/               # API routes
├── actions/               # Server Actions
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── layout/           # Layout components
│   └── forms/            # Form components
├── lib/                   # Utilities and configurations
│   ├── validations/      # Zod schemas
│   └── auth.ts           # NextAuth config
├── store/                 # Zustand stores
├── prisma/                # Database schema and migrations
├── docs/                  # Documentation
└── types/                 # TypeScript type definitions
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd farm_manager
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/farm_manager?schema=public"
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Run database migrations**
   ```bash
   npx prisma migrate dev
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Documentation

Comprehensive documentation is available in the [`docs/`](./docs) directory:

- **[Functional Requirements](./docs/functional-requirements.md)** - Complete feature specifications
- **[Technical Specification](./docs/technical-specification.md)** - Architecture and implementation details
- **[Next.js 15 Features Guide](./docs/next-js-15-features-guide.md)** - Interview preparation guide
- **[Implementation Plan](./docs/implementation-plan.md)** - Development roadmap
- **[Task Tracking](./docs/task-tracking.md)** - Progress checklist
- **[Walkthrough](./docs/walkthrough.md)** - Feature overview and demo guide

## 🎯 Next.js 15 Features Demonstrated

This project showcases modern Next.js 15 patterns:

- ✅ **Server Components** - Default for data fetching
- ✅ **Server Actions** - For mutations without API routes
- ✅ **Route Groups** - Clean URL structure with `(auth)` and `(dashboard)`
- ✅ **Middleware** - Edge-based route protection
- ✅ **Metadata API** - SEO optimization
- ✅ **Client/Server Composition** - Optimal bundle splitting

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npx prisma studio    # Open Prisma Studio (database GUI)
npx prisma generate  # Generate Prisma Client
```

### Database Management

```bash
# Create a new migration
npx prisma migrate dev --name migration_name

# Reset database (⚠️ deletes all data)
npx prisma migrate reset

# View database in browser
npx prisma studio
```

## 🎨 UI Components

This project uses [shadcn/ui](https://ui.shadcn.com/) - a collection of reusable components built with Radix UI and Tailwind CSS.

Components are located in `components/ui/` and can be customized as needed.

## 🔐 Authentication

Authentication is handled by NextAuth.js v5 with:
- Credentials provider
- JWT session strategy
- Bcrypt password hashing
- Middleware-based route protection

## 📊 Database Schema

The application uses Prisma with PostgreSQL. Key models include:

- **User** - Authentication and employee data
- **Farm** - Farm information
- **Field** - Field/plot management
- **Crop** - Crop catalog
- **Planting** - Planting records
- **Product** - Inventory items
- **Activity** - Farm activity logs

View the complete schema in [`prisma/schema.prisma`](./prisma/schema.prisma)

## 🤝 Contributing

This is a learning project for interview preparation. Feel free to:
- Add new features
- Improve existing code
- Enhance documentation
- Report issues

## 📝 License

This project is for educational purposes.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Database ORM by [Prisma](https://www.prisma.io/)

---

**Built with ❤️ for learning Next.js 15 and modern web development**
