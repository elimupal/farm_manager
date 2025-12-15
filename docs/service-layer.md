# Service Layer Documentation

## Overview

The service layer provides a clean separation between business logic and Server Actions, improving code organization, reusability, and testability.

## Architecture

```
┌─────────────────────┐
│  Server Actions     │  ← Auth, Permissions, Cache
│  (actions/*.ts)     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Services           │  ← Business Logic, Validation
│  (lib/services/*.ts)│
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Prisma Client      │  ← Database Access
└─────────────────────┘
```

## Available Services

### BaseService

Base class providing common functionality for all services.

**Features:**
- Error handling with custom error types
- Field validation
- Pagination support
- Transaction support
- Logging

### AuthService

Handles authentication and user management.

**Methods:**
- `verifyCredentials(email, password)` - Verify user login
- `createUser(data)` - Register new user
- `getUserByEmail(email)` - Find user by email
- `getUserById(id)` - Find user by ID
- `updatePassword(userId, newPassword)` - Change password
- `updateUser(userId, data)` - Update user profile
- `getAllUsers()` - Get all users

**Example:**
```typescript
import { authService } from "@/lib/services";

// Verify credentials
const user = await authService.verifyCredentials(email, password);

// Create new user
const newUser = await authService.createUser({
  email: "user@example.com",
  password: "securepassword",
  firstName: "John",
  lastName: "Doe",
  role: "WORKER"
});
```

### FieldService

Manages field operations and validation.

**Methods:**
- `getFieldsByFarm(farmId)` - Get all fields for a farm
- `getFieldById(id)` - Get field details
- `createField(data)` - Create new field with validation
- `updateField(id, data)` - Update field
- `deleteField(id)` - Delete field
- `calculateTotalArea(farmId)` - Calculate total field area
- `getFieldStatistics(fieldId)` - Get field statistics

**Example:**
```typescript
import { fieldService } from "@/lib/services";

// Create field with automatic capacity validation
const field = await fieldService.createField({
  farmId: "farm-id",
  name: "North Field",
  fieldType: "GREENHOUSE",
  area: 5.5,
  soilType: "Loamy",
  status: "ACTIVE"
});

// Get field statistics
const stats = await fieldService.getFieldStatistics(fieldId);
```

## Error Handling

Services use custom error types for better error handling:

### Error Types

- **ServiceError** - Base error class
- **NotFoundError** - Resource not found (404)
- **ValidationError** - Validation failed (400)
- **UnauthorizedError** - Not authenticated (401)
- **ForbiddenError** - No permission (403)
- **ConflictError** - Resource conflict (409)

### Example Error Handling

```typescript
try {
  const field = await fieldService.createField(data);
} catch (error) {
  if (error.name === "ValidationError") {
    // Handle validation error
    console.error(error.message);
    console.error(error.fields); // Field-specific errors
  } else if (error.name === "NotFoundError") {
    // Handle not found
    console.error(error.message);
  }
}
```

## Using Services in Server Actions

### Pattern

```typescript
"use server";

import { serviceInstance } from "@/lib/services";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function myAction(data: InputType) {
  // 1. Check authentication
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    // 2. Call service
    const result = await serviceInstance.method(data);

    // 3. Revalidate cache
    revalidatePath("/path");

    // 4. Return success
    return { success: true, data: result };
  } catch (error) {
    // 5. Handle errors
    if (error.name === "ValidationError") {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Operation failed" };
  }
}
```

## Benefits

### 1. Separation of Concerns
- **Actions**: Authentication, permissions, caching
- **Services**: Business logic, validation, data access
- **Prisma**: Database queries

### 2. Reusability
- Use same service in multiple actions
- Use in API routes
- Use in background jobs

### 3. Testability
- Easy to unit test services
- Mock Prisma client
- Test business logic independently

### 4. Maintainability
- Business logic in one place
- Consistent patterns
- Easier to find and update

### 5. Type Safety
- Full TypeScript support
- Type-safe inputs and outputs
- IntelliSense support

## Best Practices

1. **Always use services in actions**
   - Don't call Prisma directly in actions
   - Let services handle business logic

2. **Handle errors properly**
   - Catch service errors in actions
   - Return user-friendly messages
   - Log errors for debugging

3. **Keep actions thin**
   - Auth checks
   - Service calls
   - Cache revalidation
   - Error handling

4. **Keep services focused**
   - One service per resource
   - Single responsibility
   - Clear method names

5. **Use transactions when needed**
   - Use `BaseService.transaction()` for multi-step operations
   - Ensure data consistency

## Adding New Services

### 1. Create Service File

```typescript
// lib/services/my-resource.service.ts
import { BaseService } from "./base.service";

export class MyResourceService extends BaseService {
  async getAll() {
    return this.db.myResource.findMany();
  }

  async getById(id: string) {
    const resource = await this.db.myResource.findUnique({
      where: { id }
    });

    if (!resource) {
      throw new NotFoundError("MyResource", id);
    }

    return resource;
  }

  async create(data: CreateInput) {
    this.validateRequired(data, ["field1", "field2"]);
    return this.db.myResource.create({ data });
  }
}

export const myResourceService = new MyResourceService();
```

### 2. Export from Index

```typescript
// lib/services/index.ts
export * from "./my-resource.service";
```

### 3. Use in Actions

```typescript
// actions/my-resource.actions.ts
import { myResourceService } from "@/lib/services";

export async function createMyResource(data: InputType) {
  const session = await auth();
  if (!session) return { success: false, error: "Unauthorized" };

  try {
    const resource = await myResourceService.create(data);
    revalidatePath("/path");
    return { success: true, data: resource };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

## Next Steps

To extend the service layer:

1. Create additional services (Crop, Planting, Inventory, Activity)
2. Refactor remaining actions to use services
3. Add unit tests for services
4. Add integration tests for actions
5. Document service-specific business rules
