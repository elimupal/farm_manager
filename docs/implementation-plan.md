# Farm Management System - Implementation Plan

## Goal

Build a production-ready MVP of a farm management system using Next.js 15 to demonstrate modern full-stack development skills for an upcoming interview. The system will showcase Server Components, Server Actions, Zustand state management, Zod validation, and reusable component patterns.

## User Review Required

> [!IMPORTANT]
> **Database Connection Required**
> You'll need to update the `.env.local` file with your PostgreSQL connection string before running migrations. The format is:
> ```
> DATABASE_URL="postgresql://username:password@localhost:5432/farm_manager?schema=public"
> ```

> [!NOTE]
> **Learning Focus**
> This implementation prioritizes demonstrating Next.js 15 features and best practices over complete feature coverage. Some advanced features (like file uploads, advanced analytics) will be simplified for the MVP.

## Proposed Changes

### Phase 1: Foundation & Authentication

#### [NEW] [auth.ts](file:///c:/Users/IanMachariaKarimi/Documents/Projects/Upskilling/farm_manager/lib/auth.ts)
NextAuth.js v5 configuration with credentials provider, session management, and JWT strategy.

#### [NEW] [middleware.ts](file:///c:/Users/IanMachariaKarimi/Documents/Projects/Upskilling/farm_manager/middleware.ts)
Route protection middleware to guard dashboard routes and redirect unauthenticated users to login.

#### [NEW] [login/page.tsx](file:///c:/Users/IanMachariaKarimi/Documents/Projects/Upskilling/farm_manager/app/(auth)/login/page.tsx)
Login page with form validation using Zod and React Hook Form.

#### [NEW] [register/page.tsx](file:///c:/Users/IanMachariaKarimi/Documents/Projects/Upskilling/farm_manager/app/(auth)/register/page.tsx)
User registration page with password hashing using bcrypt.

#### [NEW] [auth.actions.ts](file:///c:/Users/IanMachariaKarimi/Documents/Projects/Upskilling/farm_manager/actions/auth.actions.ts)
Server Actions for login, register, and logout functionality.

---

### Phase 2: Database Setup

#### [MODIFY] [schema.prisma](file:///c:/Users/IanMachariaKarimi/Documents/Projects/Upskilling/farm_manager/prisma/schema.prisma)
Already created with comprehensive models for User, Farm, Field, Crop, Planting, Product, and Activity.

#### [NEW] [seed.ts](file:///c:/Users/IanMachariaKarimi/Documents/Projects/Upskilling/farm_manager/prisma/seed.ts)
Seed script to populate database with sample data for development and testing.

**Commands to run:**
```bash
# Create migration
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate

# Seed database
npx prisma db seed
```

---

### Phase 3: Core Layout & Navigation

#### [NEW] [layout.tsx](file:///c:/Users/IanMachariaKarimi/Documents/Projects/Upskilling/farm_manager/app/(dashboard)/layout.tsx)
Dashboard layout with sidebar navigation, header, and main content area.

#### [NEW] [sidebar.tsx](file:///c:/Users/IanMachariaKarimi/Documents/Projects/Upskilling/farm_manager/components/layout/sidebar.tsx)
Collapsible sidebar with navigation links to all major sections.

#### [NEW] [header.tsx](file:///c:/Users/IanMachariaKarimi/Documents/Projects/Upskilling/farm_manager/components/layout/header.tsx)
Header component with user menu and logout functionality.

#### [NEW] [use-user-store.ts](file:///c:/Users/IanMachariaKarimi/Documents/Projects/Upskilling/farm_manager/store/use-user-store.ts)
Zustand store for user preferences (sidebar state, theme, items per page).

---

### Phase 4: Fields Management

#### [NEW] [fields/page.tsx](file:///c:/Users/IanMachariaKarimi/Documents/Projects/Upskilling/farm_manager/app/(dashboard)/fields/page.tsx)
Server Component that fetches and displays all fields with pagination.

#### [NEW] [field.schema.ts](file:///c:/Users/IanMachariaKarimi/Documents/Projects/Upskilling/farm_manager/lib/validations/field.schema.ts)
Zod validation schema for field creation and updates.

#### [NEW] [field.actions.ts](file:///c:/Users/IanMachariaKarimi/Documents/Projects/Upskilling/farm_manager/actions/field.actions.ts)
Server Actions for CRUD operations on fields with automatic revalidation.

#### [NEW] [field-form.tsx](file:///c:/Users/IanMachariaKarimi/Documents/Projects/Upskilling/farm_manager/components/forms/field-form.tsx)
Reusable form component with React Hook Form and Zod validation.

#### [NEW] [fields-table.tsx](file:///c:/Users/IanMachariaKarimi/Documents/Projects/Upskilling/farm_manager/components/tables/fields-table.tsx)
Client Component using TanStack Table for sorting, filtering, and pagination.

---

### Phase 5: Crops & Planting

#### [NEW] [crops/page.tsx](file:///c:/Users/IanMachariaKarimi/Documents/Projects/Upskilling/farm_manager/app/(dashboard)/crops/page.tsx)
Crops catalog page listing all available crops.

#### [NEW] [plantings/page.tsx](file:///c:/Users/IanMachariaKarimi/Documents/Projects/Upskilling/farm_manager/app/(dashboard)/plantings/page.tsx)
Planting records page showing active and historical plantings.

#### [NEW] [crop.schema.ts](file:///c:/Users/IanMachariaKarimi/Documents/Projects/Upskilling/farm_manager/lib/validations/crop.schema.ts)
Zod schemas for crop and planting validation.

#### [NEW] [crop.actions.ts](file:///c:/Users/IanMachariaKarimi/Documents/Projects/Upskilling/farm_manager/actions/crop.actions.ts)
Server Actions for crop and planting management.

#### [NEW] [planting-form.tsx](file:///c:/Users/IanMachariaKarimi/Documents/Projects/Upskilling/farm_manager/components/forms/planting-form.tsx)
Form for recording new plantings with field and crop selection.

---

### Phase 6: Inventory Management

#### [NEW] [inventory/page.tsx](file:///c:/Users/IanMachariaKarimi/Documents/Projects/Upskilling/farm_manager/app/(dashboard)/inventory/page.tsx)
Inventory overview showing all products with stock levels.

#### [NEW] [inventory/applications/page.tsx](file:///c:/Users/IanMachariaKarimi/Documents/Projects/Upskilling/farm_manager/app/(dashboard)/inventory/applications/page.tsx)
Inventory application records (usage tracking).

#### [NEW] [inventory.schema.ts](file:///c:/Users/IanMachariaKarimi/Documents/Projects/Upskilling/farm_manager/lib/validations/inventory.schema.ts)
Zod schemas for product and application validation.

#### [NEW] [inventory.actions.ts](file:///c:/Users/IanMachariaKarimi/Documents/Projects/Upskilling/farm_manager/actions/inventory.actions.ts)
Server Actions for inventory management and usage tracking.

#### [NEW] [application-form.tsx](file:///c:/Users/IanMachariaKarimi/Documents/Projects/Upskilling/farm_manager/components/forms/application-form.tsx)
Form for recording agrochemical/fertilizer applications.

---

### Phase 7: Employees & Activities

#### [NEW] [employees/page.tsx](file:///c:/Users/IanMachariaKarimi/Documents/Projects/Upskilling/farm_manager/app/(dashboard)/employees/page.tsx)
Employee management page with role-based filtering.

#### [NEW] [activities/page.tsx](file:///c:/Users/IanMachariaKarimi/Documents/Projects/Upskilling/farm_manager/app/(dashboard)/activities/page.tsx)
Activity log showing all farm activities with filtering.

#### [NEW] [employee.schema.ts](file:///c:/Users/IanMachariaKarimi/Documents/Projects/Upskilling/farm_manager/lib/validations/employee.schema.ts)
Zod schemas for employee and activity validation.

#### [NEW] [employee.actions.ts](file:///c:/Users/IanMachariaKarimi/Documents/Projects/Upskilling/farm_manager/actions/employee.actions.ts)
Server Actions for employee and activity management.

---

### Phase 8: Dashboard & Analytics

#### [NEW] [dashboard/page.tsx](file:///c:/Users/IanMachariaKarimi/Documents/Projects/Upskilling/farm_manager/app/(dashboard)/page.tsx)
Dashboard home page with stats cards, charts, and recent activities using Suspense for streaming.

#### [NEW] [stats-card.tsx](file:///c:/Users/IanMachariaKarimi/Documents/Projects/Upskilling/farm_manager/components/dashboard/stats-card.tsx)
Reusable stats card component for displaying KPIs.

#### [NEW] [recent-activities.tsx](file:///c:/Users/IanMachariaKarimi/Documents/Projects/Upskilling/farm_manager/components/dashboard/recent-activities.tsx)
Widget showing recent farm activities.

#### [NEW] [inventory-alerts.tsx](file:///c:/Users/IanMachariaKarimi/Documents/Projects/Upskilling/farm_manager/components/dashboard/inventory-alerts.tsx)
Widget showing low stock alerts.

---

### Phase 9: Shared Components & Utilities

#### [NEW] [data-table.tsx](file:///c:/Users/IanMachariaKarimi/Documents/Projects/Upskilling/farm_manager/components/tables/data-table.tsx)
Generic reusable data table component with TanStack Table for pagination, sorting, and filtering.

#### [NEW] [constants.ts](file:///c:/Users/IanMachariaKarimi/Documents/Projects/Upskilling/farm_manager/lib/constants.ts)
App-wide constants for field types, crop categories, user roles, etc.

#### [NEW] [use-pagination.ts](file:///c:/Users/IanMachariaKarimi/Documents/Projects/Upskilling/farm_manager/hooks/use-pagination.ts)
Custom hook for pagination logic.

## Verification Plan

### Automated Tests
Since this is a learning project with a 2-day timeline, we'll focus on manual testing rather than automated tests. However, the code structure supports easy addition of tests later.

### Manual Verification

1. **Authentication Flow**
   - Register a new user
   - Login with credentials
   - Verify protected routes redirect to login
   - Test logout functionality

2. **Fields Management**
   - Create a new field (greenhouse, open field, etc.)
   - View fields list with pagination
   - Edit field details
   - Delete a field

3. **Crops & Planting**
   - Add crops to catalog
   - Create planting records linking fields and crops
   - View planting history

4. **Inventory Management**
   - Add products (agrochemicals, fertilizers)
   - Record inventory applications
   - View stock levels and low stock alerts

5. **Activities**
   - Log farm activities
   - View activity timeline
   - Filter activities by type

6. **Dashboard**
   - Verify stats cards display correct data
   - Check charts render properly
   - Test recent activities widget

7. **Responsive Design**
   - Test on mobile viewport
   - Verify sidebar collapses on mobile
   - Check form layouts on small screens

8. **Next.js 15 Features**
   - Verify Server Components load data correctly
   - Test Server Actions for mutations
   - Check Suspense boundaries show loading states
   - Verify metadata API sets correct page titles

## Next Steps After Approval

1. Set up PostgreSQL database connection
2. Run Prisma migrations
3. Implement authentication with NextAuth.js
4. Build core layout and navigation
5. Implement each module phase by phase
6. Test and polish the UI

Ready to proceed! 🚀
