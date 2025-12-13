# Farm Management System - Technical Specification

## 1. Project Architecture

### 1.1 Folder Structure

```
farm_manager/
├── src/
│   ├── app/                          # Next.js 15 App Router
│   │   ├── (auth)/                   # Auth route group
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/              # Protected route group
│   │   │   ├── layout.tsx            # Dashboard layout with sidebar
│   │   │   ├── page.tsx              # Dashboard home
│   │   │   ├── fields/               # Field management
│   │   │   ├── crops/                # Crop management
│   │   │   ├── inventory/            # Inventory management
│   │   │   │   ├── agrochemicals/
│   │   │   │   ├── fertilizers/
│   │   │   │   └── applications/     # Usage tracking
│   │   │   ├── employees/            # Employee management
│   │   │   └── activities/           # Activity logs
│   │   ├── api/                      # API routes (if needed)
│   │   │   └── auth/[...nextauth]/
│   │   ├── layout.tsx                # Root layout
│   │   └── globals.css
│   ├── components/                   # React components
│   │   ├── ui/                       # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── table.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── select.tsx
│   │   │   ├── form.tsx
│   │   │   └── ...
│   │   ├── forms/                    # Feature-specific forms
│   │   │   ├── field-form.tsx
│   │   │   ├── crop-form.tsx
│   │   │   ├── inventory-form.tsx
│   │   │   └── application-form.tsx
│   │   ├── tables/                   # Reusable table components
│   │   │   ├── data-table.tsx        # Generic data table with pagination
│   │   │   ├── fields-table.tsx
│   │   │   ├── crops-table.tsx
│   │   │   └── inventory-table.tsx
│   │   ├── layout/                   # Layout components
│   │   │   ├── sidebar.tsx
│   │   │   ├── header.tsx
│   │   │   └── breadcrumb.tsx
│   │   ├── dashboard/                # Dashboard-specific components
│   │   │   ├── stats-card.tsx
│   │   │   ├── recent-activities.tsx
│   │   │   └── inventory-alerts.tsx
│   │   └── providers/                # Context providers
│   │       └── theme-provider.tsx
│   ├── lib/                          # Utility libraries
│   │   ├── prisma.ts                 # Prisma client singleton
│   │   ├── auth.ts                   # NextAuth configuration
│   │   ├── utils.ts                  # Utility functions (cn, etc.)
│   │   ├── constants.ts              # App-wide constants
│   │   └── validations/              # Zod schemas
│   │       ├── field.schema.ts
│   │       ├── crop.schema.ts
│   │       ├── inventory.schema.ts
│   │       ├── employee.schema.ts
│   │       └── activity.schema.ts
│   ├── actions/                      # Server Actions
│   │   ├── field.actions.ts
│   │   ├── crop.actions.ts
│   │   ├── inventory.actions.ts
│   │   ├── employee.actions.ts
│   │   └── activity.actions.ts
│   ├── store/                        # Zustand stores
│   │   ├── use-user-store.ts         # User preferences
│   │   ├── use-filter-store.ts       # Filter states
│   │   └── use-form-store.ts         # Multi-step form state
│   ├── types/                        # TypeScript types
│   │   ├── index.ts
│   │   ├── field.types.ts
│   │   ├── crop.types.ts
│   │   └── inventory.types.ts
│   └── hooks/                        # Custom React hooks
│       ├── use-pagination.ts
│       ├── use-debounce.ts
│       └── use-table-filters.ts
├── prisma/
│   ├── schema.prisma                 # Database schema
│   ├── seed.ts                       # Seed data
│   └── migrations/
├── public/
│   └── images/
├── specs/                            # Documentation
│   ├── functional-requirements.md
│   └── technical-specification.md
├── .env.local
├── .env.example
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── components.json                   # shadcn/ui config
└── package.json
```

## 2. Technology Stack Details

### 2.1 Core Dependencies

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@prisma/client": "^5.x",
    "next-auth": "^5.0.0-beta",
    "zod": "^3.22.0",
    "zustand": "^4.5.0",
    "react-hook-form": "^7.49.0",
    "@hookform/resolvers": "^3.3.0",
    "tailwindcss": "^3.4.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0",
    "lucide-react": "^0.300.0",
    "date-fns": "^3.0.0",
    "@tanstack/react-table": "^8.11.0",
    "recharts": "^2.10.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "prisma": "^5.x",
    "@types/node": "^20.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "eslint": "^8.56.0",
    "eslint-config-next": "^15.0.0"
  }
}
```

### 2.2 Key Libraries & Their Purpose

- **Next.js 15**: App Router, Server Components, Server Actions
- **Prisma**: Type-safe database ORM
- **NextAuth.js v5**: Authentication & session management
- **Zod**: Runtime type validation for forms and API inputs
- **Zustand**: Lightweight state management (user preferences, filters)
- **React Hook Form**: Performant form handling
- **shadcn/ui**: Reusable, accessible UI components
- **TanStack Table**: Powerful table component with pagination, sorting, filtering
- **Recharts**: Data visualization for analytics
- **Lucide React**: Icon library
- **date-fns**: Date manipulation

## 3. Next.js 15 Features to Showcase

### 3.1 Server Components (Default)
- **Use for**: Data fetching, rendering lists, displaying static content
- **Benefits**: Zero client-side JavaScript, faster initial load, SEO-friendly
- **Examples**:
  - Dashboard page fetching stats
  - Field list page
  - Inventory list page

```typescript
// app/(dashboard)/fields/page.tsx
import { prisma } from '@/lib/prisma';

export default async function FieldsPage() {
  const fields = await prisma.field.findMany({
    include: { plantings: true }
  });
  
  return <FieldsTable data={fields} />;
}
```

### 3.2 Server Actions
- **Use for**: Form submissions, data mutations, database operations
- **Benefits**: No API routes needed, automatic revalidation, progressive enhancement
- **Examples**:
  - Creating/updating fields
  - Recording inventory applications
  - Employee management

```typescript
// actions/field.actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { fieldSchema } from '@/lib/validations/field.schema';

export async function createField(formData: FormData) {
  const validated = fieldSchema.parse(Object.fromEntries(formData));
  
  const field = await prisma.field.create({
    data: validated
  });
  
  revalidatePath('/fields');
  return { success: true, data: field };
}
```

### 3.3 Route Groups
- **Use for**: Organizing routes without affecting URL structure
- **Examples**:
  - `(auth)` for login/register pages
  - `(dashboard)` for protected pages with shared layout

### 3.4 Parallel Routes & Intercepting Routes
- **Use for**: Modals, side panels (advanced feature)
- **Example**: Opening a field detail modal while staying on the list page

### 3.5 Streaming & Suspense
- **Use for**: Loading states, progressive rendering
- **Example**: Dashboard with multiple data sources

```typescript
// app/(dashboard)/page.tsx
import { Suspense } from 'react';

export default function DashboardPage() {
  return (
    <div>
      <Suspense fallback={<StatsCardSkeleton />}>
        <StatsCards />
      </Suspense>
      <Suspense fallback={<TableSkeleton />}>
        <RecentActivities />
      </Suspense>
    </div>
  );
}
```

### 3.6 Metadata API
- **Use for**: SEO, dynamic page titles
- **Example**:

```typescript
export const metadata = {
  title: 'Fields | Farm Manager',
  description: 'Manage your farm fields and plots'
};
```

### 3.7 Middleware
- **Use for**: Authentication checks, redirects
- **Example**: Protecting dashboard routes

```typescript
// middleware.ts
export { auth as middleware } from '@/lib/auth';

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
```

## 4. Database Schema (Prisma)

### 4.1 Core Models for MVP Phase 1

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================
// AUTHENTICATION & USERS
// ============================================

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  password      String    // Hashed
  firstName     String
  lastName      String
  role          UserRole  @default(WORKER)
  phone         String?
  status        EmployeeStatus @default(ACTIVE)
  hireDate      DateTime  @default(now())
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // Relations
  plantings     Planting[]
  activities    Activity[]
  applications  InventoryApplication[]
  assignedTasks Task[]
  
  @@map("users")
}

enum UserRole {
  OWNER
  MANAGER
  SUPERVISOR
  WORKER
  AGRONOMIST
}

enum EmployeeStatus {
  ACTIVE
  ON_LEAVE
  TERMINATED
}

// ============================================
// FARM & FIELDS
// ============================================

model Farm {
  id          String   @id @default(cuid())
  name        String
  location    String
  totalArea   Float    // in hectares
  climateZone String?
  soilType    String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relations
  fields      Field[]
  
  @@map("farms")
}

model Field {
  id              String      @id @default(cuid())
  farmId          String
  name            String
  fieldType       FieldType
  area            Float       // in hectares
  location        String?     // GPS coordinates
  soilType        String?
  irrigationType  String?
  status          FieldStatus @default(ACTIVE)
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
  
  // Relations
  farm            Farm        @relation(fields: [farmId], references: [id], onDelete: Cascade)
  plantings       Planting[]
  activities      Activity[]
  applications    InventoryApplication[]
  
  @@map("fields")
}

enum FieldType {
  OPEN_FIELD
  GREENHOUSE
  SCREENHOUSE
  SHADE_HOUSE
  NURSERY
  HYDROPONICS
}

enum FieldStatus {
  ACTIVE
  FALLOW
  UNDER_PREPARATION
}

// ============================================
// CROPS
// ============================================

model Crop {
  id              String   @id @default(cuid())
  name            String
  scientificName  String?
  category        CropCategory
  variety         String?
  growthCycleDays Int      // Expected days from planting to harvest
  expectedYield   Float?   // per hectare
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  // Relations
  plantings       Planting[]
  
  @@map("crops")
}

enum CropCategory {
  VEGETABLES
  FRUITS
  CEREALS
  LEGUMES
  HERBS
  FLOWERS
  OTHER
}

model Planting {
  id                String        @id @default(cuid())
  fieldId           String
  cropId            String
  plantingDate      DateTime
  expectedHarvestDate DateTime
  plantingMethod    PlantingMethod
  seedSource        String?
  quantityPlanted   Float?
  plantingDensity   String?
  status            PlantingStatus @default(GROWING)
  plantedBy         String
  notes             String?
  createdAt         DateTime      @default(now())
  updatedAt         DateTime      @updatedAt
  
  // Relations
  field             Field         @relation(fields: [fieldId], references: [id], onDelete: Cascade)
  crop              Crop          @relation(fields: [cropId], references: [id])
  plantedByUser     User          @relation(fields: [plantedBy], references: [id])
  activities        Activity[]
  
  @@map("plantings")
}

enum PlantingMethod {
  DIRECT_SEEDING
  TRANSPLANTING
}

enum PlantingStatus {
  GROWING
  HARVESTED
  FAILED
}

// ============================================
// INVENTORY
// ============================================

model Product {
  id              String        @id @default(cuid())
  name            String
  brand           String?
  category        ProductCategory
  type            String?       // e.g., "Insecticide", "NPK 20-10-10"
  activeIngredient String?
  manufacturer    String?
  unit            String        // e.g., "liters", "kg"
  reorderLevel    Float?
  currentStock    Float         @default(0)
  costPerUnit     Float?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  
  // Relations
  batches         ProductBatch[]
  applications    InventoryApplication[]
  
  @@map("products")
}

enum ProductCategory {
  AGROCHEMICAL
  FERTILIZER
  SEED
  EQUIPMENT
}

model ProductBatch {
  id              String   @id @default(cuid())
  productId       String
  batchNumber     String
  quantity        Float
  expiryDate      DateTime?
  purchaseDate    DateTime
  supplier        String?
  costPerUnit     Float?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  // Relations
  product         Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  @@map("product_batches")
}

model InventoryApplication {
  id                String   @id @default(cuid())
  productId         String
  fieldId           String
  plantingId        String?
  applicationDate   DateTime
  quantityUsed      Float
  applicationMethod String?  // e.g., "spray", "drip"
  dilutionRate      String?
  reason            String?  // e.g., pest name, nutrient deficiency
  appliedBy         String
  weatherConditions String?
  notes             String?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  // Relations
  product           Product  @relation(fields: [productId], references: [id])
  field             Field    @relation(fields: [fieldId], references: [id], onDelete: Cascade)
  appliedByUser     User     @relation(fields: [appliedBy], references: [id])
  
  @@map("inventory_applications")
}

// ============================================
// ACTIVITIES
// ============================================

model Activity {
  id              String       @id @default(cuid())
  type            ActivityType
  fieldId         String
  plantingId      String?
  activityDate    DateTime
  performedBy     String
  description     String
  duration        Int?         // in minutes
  notes           String?
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt
  
  // Relations
  field           Field        @relation(fields: [fieldId], references: [id], onDelete: Cascade)
  planting        Planting?    @relation(fields: [plantingId], references: [id])
  performedByUser User         @relation(fields: [performedBy], references: [id])
  
  @@map("activities")
}

enum ActivityType {
  PLANTING
  IRRIGATION
  FERTILIZATION
  PEST_CONTROL
  WEEDING
  PRUNING
  HARVESTING
  SOIL_PREPARATION
  OTHER
}
```

## 5. Zod Validation Schemas

### 5.1 Example: Field Schema

```typescript
// lib/validations/field.schema.ts
import { z } from 'zod';

export const fieldSchema = z.object({
  farmId: z.string().cuid(),
  name: z.string().min(1, 'Field name is required').max(100),
  fieldType: z.enum([
    'OPEN_FIELD',
    'GREENHOUSE',
    'SCREENHOUSE',
    'SHADE_HOUSE',
    'NURSERY',
    'HYDROPONICS'
  ]),
  area: z.number().positive('Area must be positive'),
  location: z.string().optional(),
  soilType: z.string().optional(),
  irrigationType: z.string().optional(),
  status: z.enum(['ACTIVE', 'FALLOW', 'UNDER_PREPARATION']).default('ACTIVE')
});

export type FieldFormData = z.infer<typeof fieldSchema>;
```

### 5.2 Example: Inventory Application Schema

```typescript
// lib/validations/inventory.schema.ts
import { z } from 'zod';

export const inventoryApplicationSchema = z.object({
  productId: z.string().cuid(),
  fieldId: z.string().cuid(),
  plantingId: z.string().cuid().optional(),
  applicationDate: z.date(),
  quantityUsed: z.number().positive('Quantity must be positive'),
  applicationMethod: z.string().optional(),
  dilutionRate: z.string().optional(),
  reason: z.string().optional(),
  weatherConditions: z.string().optional(),
  notes: z.string().optional()
});

export type InventoryApplicationFormData = z.infer<typeof inventoryApplicationSchema>;
```

## 6. Zustand Store Examples

### 6.1 User Preferences Store

```typescript
// store/use-user-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  sidebarCollapsed: boolean;
  defaultView: 'grid' | 'list';
  itemsPerPage: number;
}

interface UserStore extends UserPreferences {
  setTheme: (theme: UserPreferences['theme']) => void;
  toggleSidebar: () => void;
  setDefaultView: (view: UserPreferences['defaultView']) => void;
  setItemsPerPage: (count: number) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      theme: 'system',
      sidebarCollapsed: false,
      defaultView: 'list',
      itemsPerPage: 10,
      setTheme: (theme) => set({ theme }),
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setDefaultView: (view) => set({ defaultView: view }),
      setItemsPerPage: (count) => set({ itemsPerPage: count })
    }),
    {
      name: 'user-preferences'
    }
  )
);
```

### 6.2 Filter Store (for tables)

```typescript
// store/use-filter-store.ts
import { create } from 'zustand';

interface FilterStore {
  fieldFilters: {
    fieldType?: string;
    status?: string;
    search?: string;
  };
  inventoryFilters: {
    category?: string;
    lowStock?: boolean;
    search?: string;
  };
  setFieldFilters: (filters: Partial<FilterStore['fieldFilters']>) => void;
  setInventoryFilters: (filters: Partial<FilterStore['inventoryFilters']>) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterStore>((set) => ({
  fieldFilters: {},
  inventoryFilters: {},
  setFieldFilters: (filters) =>
    set((state) => ({
      fieldFilters: { ...state.fieldFilters, ...filters }
    })),
  setInventoryFilters: (filters) =>
    set((state) => ({
      inventoryFilters: { ...state.inventoryFilters, ...filters }
    })),
  resetFilters: () => set({ fieldFilters: {}, inventoryFilters: {} })
}));
```

## 7. Reusable Component Patterns

### 7.1 Generic Data Table with Pagination

```typescript
// components/tables/data-table.tsx
'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  getSortedRowModel,
  getFilteredRowModel
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageSize?: number;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageSize = 10
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: { pageSize }
    }
  });

  return (
    <div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {/* Pagination */}
      <div className="flex items-center justify-between px-2 py-4">
        <div className="text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
```

### 7.2 Form Component with React Hook Form + Zod

```typescript
// components/forms/field-form.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { fieldSchema, type FieldFormData } from '@/lib/validations/field.schema';
import { createField } from '@/actions/field.actions';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

export function FieldForm() {
  const form = useForm<FieldFormData>({
    resolver: zodResolver(fieldSchema),
    defaultValues: {
      name: '',
      area: 0,
      status: 'ACTIVE'
    }
  });

  async function onSubmit(data: FieldFormData) {
    const result = await createField(data);
    if (result.success) {
      form.reset();
      // Show success toast
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Field Name</FormLabel>
              <FormControl>
                <Input placeholder="North Field" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="fieldType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Field Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select field type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="OPEN_FIELD">Open Field</SelectItem>
                  <SelectItem value="GREENHOUSE">Greenhouse</SelectItem>
                  <SelectItem value="SCREENHOUSE">Screenhouse</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Creating...' : 'Create Field'}
        </Button>
      </form>
    </Form>
  );
}
```

## 8. Best Practices & Patterns

### 8.1 Error Handling

```typescript
// lib/errors.ts
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

// In Server Actions
export async function createField(data: FieldFormData) {
  try {
    const validated = fieldSchema.parse(data);
    const field = await prisma.field.create({ data: validated });
    revalidatePath('/fields');
    return { success: true, data: field };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Validation failed', details: error.errors };
    }
    return { success: false, error: 'Failed to create field' };
  }
}
```

### 8.2 Pagination Helper

```typescript
// lib/pagination.ts
export interface PaginationParams {
  page: number;
  pageSize: number;
}

export function getPaginationParams(searchParams: URLSearchParams): PaginationParams {
  const page = Math.max(1, Number(searchParams.get('page')) || 1);
  const pageSize = Math.max(1, Math.min(100, Number(searchParams.get('pageSize')) || 10));
  
  return { page, pageSize };
}

export function getPrismaSkipTake(params: PaginationParams) {
  return {
    skip: (params.page - 1) * params.pageSize,
    take: params.pageSize
  };
}
```

### 8.3 Type-Safe Environment Variables

```typescript
// lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(1),
  NEXTAUTH_URL: z.string().url()
});

export const env = envSchema.parse(process.env);
```

## 9. Development Workflow

### 9.1 Initial Setup Commands

```bash
# Initialize Next.js 15 with TypeScript
npx create-next-app@latest farm_manager --typescript --tailwind --app --eslint

# Install dependencies
npm install @prisma/client next-auth@beta zod zustand react-hook-form @hookform/resolvers
npm install @tanstack/react-table recharts date-fns lucide-react
npm install -D prisma

# Initialize Prisma
npx prisma init

# Install shadcn/ui
npx shadcn-ui@latest init

# Add shadcn components
npx shadcn-ui@latest add button input card table dialog select form
```

### 9.2 Database Commands

```bash
# Create migration
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate

# Seed database
npx prisma db seed

# Open Prisma Studio
npx prisma studio
```

## 10. Interview Talking Points

### 10.1 Architecture Decisions
- **Why Server Components?** Reduced client bundle, better SEO, faster initial load
- **Why Server Actions?** Simplified data mutations, progressive enhancement, automatic revalidation
- **Why Zustand over Context?** Lightweight, no provider hell, better performance for global state
- **Why Zod?** Runtime validation, type inference, great DX with TypeScript
- **Why Prisma?** Type-safe queries, migrations, excellent DX

### 10.2 Scalability Considerations
- **Pagination**: All lists use cursor or offset pagination
- **Indexing**: Database indexes on frequently queried fields
- **Caching**: Next.js automatic caching + revalidation strategies
- **Code splitting**: Route-based automatic splitting
- **Component reusability**: Generic components (DataTable, Form fields)

### 10.3 Performance Optimizations
- **Server Components**: Default for data fetching
- **Streaming**: Suspense boundaries for progressive rendering
- **Image optimization**: Next.js Image component
- **Font optimization**: Next.js font optimization
- **Bundle analysis**: Regular bundle size monitoring

## 11. MVP Implementation Timeline (2 Days)

### Day 1 (8 hours)
1. **Setup (2 hours)**
   - Initialize project
   - Install dependencies
   - Configure shadcn/ui
   - Setup Prisma schema
   - Run migrations

2. **Authentication (2 hours)**
   - NextAuth.js setup
   - Login/register pages
   - Middleware protection

3. **Core Layout (2 hours)**
   - Dashboard layout
   - Sidebar navigation
   - Header component

4. **Fields Module (2 hours)**
   - Field list page (Server Component)
   - Field form (Client Component)
   - Create/Edit Server Actions
   - Data table with pagination

### Day 2 (8 hours)
1. **Crops & Planting (2 hours)**
   - Crop catalog
   - Planting records
   - Forms with Zod validation

2. **Inventory (3 hours)**
   - Products list
   - Inventory application form
   - Stock tracking
   - Low stock alerts

3. **Dashboard (2 hours)**
   - Stats cards
   - Recent activities
   - Charts with Recharts

4. **Polish & Testing (1 hour)**
   - Error handling
   - Loading states
   - Responsive design check

## 12. Next Steps

Once you approve this technical specification, we'll:
1. Initialize the Next.js 15 project
2. Setup the database schema
3. Configure authentication
4. Build the core modules phase by phase

Ready to start building? 🚀
