# Farm Management System - Functional Requirements

## 1. Executive Summary

The Farm Management System is a comprehensive web application designed to help farmers and farm managers efficiently manage their agricultural operations, from crop planning to harvest tracking, inventory management, and workforce coordination.

## 2. User Roles & Permissions

### 2.1 User Types
- **Farm Owner/Manager**: Full access to all features, can manage employees, view reports
- **Farm Supervisor**: Can manage day-to-day operations, assign tasks, record activities
- **Farm Worker**: Can view assigned tasks, record completed activities
- **Agronomist/Consultant**: Read-only access to crop and field data, can add recommendations

### 2.2 Authentication & Authorization
- Email/password authentication
- Role-based access control (RBAC)
- Session management
- Password reset functionality

## 3. Core Modules

### 3.1 Farm Setup & Configuration

#### 3.1.1 Farm Profile
- Farm name, location (GPS coordinates)
- Total farm area
- Climate zone
- Soil type(s)
- Water sources
- Contact information

#### 3.1.2 Field/Plot Management
- **Field Types**:
  - Open field
  - Greenhouse
  - Screenhouse
  - Shade house
  - Nursery
  - Hydroponics/Aquaponics
  
- **Field Attributes**:
  - Field name/identifier
  - Area (size in acres/hectares)
  - Location/GPS coordinates
  - Soil type
  - Irrigation system type
  - Current status (active, fallow, under preparation)
  - Field history (crop rotation tracking)

### 3.2 Crop Management

#### 3.2.1 Crop Catalog
- Crop name (common & scientific)
- Crop category (vegetables, fruits, cereals, legumes, etc.)
- Variety/cultivar
- Growing season
- Expected yield per unit area
- Growth cycle duration
- Optimal growing conditions

#### 3.2.2 Planting Records
- Field/plot assigned
- Crop & variety planted
- Planting date
- Expected harvest date
- Planting method (direct seeding, transplanting)
- Seed source & batch number
- Quantity planted (area covered, number of plants)
- Planting density/spacing
- Responsible person

#### 3.2.3 Crop Growth Tracking
- Growth stages (germination, vegetative, flowering, fruiting, maturity)
- Stage transition dates
- Health status
- Photos/observations
- Weather conditions during growth
- Pest & disease incidents

### 3.3 Inventory Management

#### 3.3.1 Agrochemicals Inventory
- **Product Information**:
  - Product name & brand
  - Active ingredient(s)
  - Category (insecticide, fungicide, herbicide, etc.)
  - Formulation type
  - Manufacturer
  - Batch/lot number
  - Expiry date
  - Safety data sheet (SDS) link

- **Stock Management**:
  - Current quantity in stock
  - Unit of measurement
  - Reorder level
  - Storage location
  - Purchase history
  - Cost per unit

- **Usage Tracking**:
  - Application date & time
  - Field/crop applied to
  - Quantity used
  - Application method (spray, drip, soil drench)
  - Dilution rate/concentration
  - Weather conditions during application
  - Applied by (employee)
  - Reason for application (pest/disease name)
  - Pre-harvest interval (PHI) compliance
  - Re-entry interval (REI) tracking

#### 3.3.2 Fertilizers Inventory
- Similar structure to agrochemicals
- Additional fields:
  - NPK ratio or nutrient composition
  - Organic vs. synthetic
  - Application rate per area
  - Soil test results that prompted application

#### 3.3.3 Seeds & Planting Materials
- Seed variety
- Quantity in stock
- Germination rate
- Purchase date & source
- Storage conditions
- Usage tracking

#### 3.3.4 Equipment & Tools
- Equipment name & type
- Purchase date & cost
- Maintenance schedule
- Current status (operational, under repair, retired)
- Assigned to (employee/field)
- Fuel/power consumption tracking

#### 3.3.5 Harvest Inventory
- Crop harvested
- Harvest date
- Quantity harvested
- Quality grade
- Storage location
- Destination (sold, stored, processed, waste)
- Market price at harvest

### 3.4 Employee Management

#### 3.4.1 Employee Records
- Personal information (name, ID, contact)
- Role/position
- Hire date
- Skills/certifications
- Emergency contact
- Employment status (active, on leave, terminated)

#### 3.4.2 Task Assignment
- Task description
- Assigned to (employee/team)
- Field/area
- Priority level
- Due date
- Status (pending, in progress, completed)
- Estimated vs. actual time

#### 3.4.3 Attendance & Time Tracking
- Daily attendance records
- Clock in/out times
- Hours worked
- Overtime tracking
- Leave management (sick, vacation, etc.)

#### 3.4.4 Performance & Training
- Training records
- Certifications (pesticide application license, etc.)
- Performance notes
- Safety incidents

### 3.5 Activity Logging & Traceability

#### 3.5.1 Farm Activities Log
- Activity type (planting, irrigation, fertilization, pest control, weeding, pruning, harvesting)
- Date & time
- Field/crop
- Employee(s) involved
- Materials used (with batch numbers)
- Quantity/area covered
- Weather conditions
- Notes/observations
- Photos

#### 3.5.2 Traceability
- Complete history from seed to harvest for each crop batch
- Input usage history (what was applied, when, by whom)
- Compliance with food safety standards (GlobalGAP, organic certification)
- Batch/lot tracking for harvest

### 3.6 Irrigation Management

- Irrigation schedule
- Water source & quantity used
- Irrigation method (drip, sprinkler, flood)
- Field/crop irrigated
- Duration
- Responsible person
- Water quality tests

### 3.7 Pest & Disease Management

- Pest/disease identification
- Affected crop/field
- Severity level
- Detection date
- Treatment applied (linked to agrochemicals inventory)
- Treatment effectiveness
- Follow-up actions
- Photos of damage

### 3.8 Financial Management

#### 3.8.1 Expenses
- Category (seeds, fertilizers, labor, equipment, utilities)
- Amount
- Date
- Vendor/supplier
- Payment method
- Related to (field/crop/activity)
- Receipt/invoice upload

#### 3.8.2 Revenue
- Sales records
- Crop/product sold
- Quantity
- Price per unit
- Total revenue
- Customer/buyer
- Payment status

#### 3.8.3 Reports
- Profit & loss by crop
- Profit & loss by field
- Cost per unit produced
- ROI analysis
- Budget vs. actual

### 3.9 Reporting & Analytics

#### 3.9.1 Dashboard
- Current crop status overview
- Upcoming tasks & deadlines
- Inventory alerts (low stock, expiring products)
- Weather forecast
- Recent activities
- Key performance indicators (KPIs)

#### 3.9.2 Reports
- **Production Reports**:
  - Yield by crop/field/season
  - Crop performance comparison
  - Harvest calendar
  
- **Inventory Reports**:
  - Stock levels
  - Usage trends
  - Expiring products alert
  - Reorder recommendations
  
- **Labor Reports**:
  - Employee productivity
  - Labor cost by activity/crop
  - Attendance summary
  
- **Compliance Reports**:
  - Agrochemical usage log
  - PHI/REI compliance
  - Organic certification records
  - Traceability reports

- **Financial Reports**:
  - Income statement
  - Cash flow
  - Cost analysis by crop/field
  - Budget variance

#### 3.9.3 Analytics
- Yield trends over seasons
- Input efficiency (fertilizer/pesticide per unit yield)
- Labor productivity trends
- Cost optimization insights
- Predictive analytics (yield forecasting)

### 3.10 Notifications & Alerts

- Low inventory alerts
- Expiring products (agrochemicals, seeds)
- Upcoming tasks/deadlines
- PHI/REI compliance reminders
- Equipment maintenance due
- Weather alerts
- Pest/disease outbreak warnings

## 4. Technical Requirements

### 4.1 Frontend
- **Framework**: Next.js 15 (App Router)
- **State Management**: Zustand
- **Validation**: Zod
- **UI Components**: Reusable component library (similar to Figma components approach)
- **Styling**: TailwindCSS
- **Forms**: React Hook Form with Zod validation
- **Data Fetching**: Server Components, Server Actions, React Query/TanStack Query
- **Charts**: Recharts or Chart.js for analytics

### 4.2 Backend
- **API**: Next.js API Routes / Server Actions
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js (Auth.js v5)
- **File Upload**: For photos, documents (receipts, SDS)
- **Image Optimization**: Next.js Image component

### 4.3 Additional Features
- **Responsive Design**: Mobile-first approach (farmers often use mobile devices in the field)
- **Offline Capability**: PWA features for field use without internet
- **Export**: PDF reports, CSV data export
- **Multi-language**: Support for local languages (optional)
- **Dark Mode**: User preference

## 5. Data Models (High-Level)

### Core Entities
1. **User** (employees, managers)
2. **Farm** (farm profile)
3. **Field** (plots, greenhouses, etc.)
4. **Crop** (crop catalog)
5. **Planting** (planting records)
6. **Product** (agrochemicals, fertilizers, seeds)
7. **Inventory** (stock levels)
8. **InventoryTransaction** (usage, purchases)
9. **Activity** (farm activities log)
10. **Task** (assigned tasks)
11. **Harvest** (harvest records)
12. **Expense** (financial transactions)
13. **Sale** (revenue records)

### Relationships
- Farm → Fields (one-to-many)
- Field → Plantings (one-to-many)
- Planting → Crop (many-to-one)
- Activity → Field, User, Products (many-to-one)
- InventoryTransaction → Product, User, Field (many-to-one)

## 6. MVP (Minimum Viable Product) Scope

For your interview preparation, I recommend focusing on these core features first:

### Phase 1 - Foundation (MVP)
1. ✅ Authentication & user management
2. ✅ Farm & field setup
3. ✅ Crop catalog & planting records
4. ✅ Basic inventory management (agrochemicals & fertilizers)
5. ✅ Inventory usage tracking (application records)
6. ✅ Employee management
7. ✅ Activity logging
8. ✅ Basic dashboard

### Phase 2 - Enhanced Features
1. Task management & assignment
2. Harvest tracking
3. Financial management (expenses & revenue)
4. Reports & analytics
5. Notifications

### Phase 3 - Advanced Features
1. Pest & disease management
2. Irrigation management
3. Advanced analytics & forecasting
4. Compliance reports
5. Mobile optimization & PWA
6. Export functionality

## 7. Next.js 15 Features to Showcase

- **Server Components**: For data fetching and rendering
- **Server Actions**: For mutations and form submissions
- **Partial Prerendering**: For optimal performance
- **Metadata API**: For SEO
- **Route Handlers**: For API endpoints
- **Middleware**: For authentication
- **Image Optimization**: For crop photos
- **Font Optimization**: For better performance
- **Streaming**: For large data sets

## 8. Interview Demonstration Points

This project will showcase:
- ✅ **Zustand**: Global state management (user preferences, cart-like inventory selection)
- ✅ **Zod**: Schema validation for forms and API inputs
- ✅ **Reusable Components**: Component library approach (buttons, inputs, modals, cards)
- ✅ **TypeScript**: Type safety throughout
- ✅ **Prisma**: Database ORM with type-safe queries
- ✅ **Server Actions**: Modern data mutations
- ✅ **Server Components**: Optimal data fetching
- ✅ **Form Handling**: React Hook Form + Zod
- ✅ **Complex Data Relationships**: Real-world database design
- ✅ **Role-Based Access Control**: Security implementation
- ✅ **File Uploads**: Image handling
- ✅ **Data Visualization**: Charts and analytics
- ✅ **Responsive Design**: Mobile-first approach

## 9. Questions for Alignment

Before we proceed, please confirm:

1. **Scope**: Should we start with the MVP (Phase 1) features?
2. **Database**: PostgreSQL is good. Should we use Prisma as the ORM?
3. **Authentication**: NextAuth.js v5 (Auth.js) or another solution?
4. **UI Library**: Should we build custom components or use a library like shadcn/ui (which demonstrates reusable components well)?
5. **Deployment Target**: Will you need to deploy this (Vercel, Railway, etc.) or just run locally?
6. **Time Frame**: How much time do you have before the interview?
7. **Focus Areas**: Are there specific Next.js 15 features or patterns you want to emphasize?

Please review this document and let me know your thoughts!
