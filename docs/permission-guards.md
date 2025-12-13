# Permission Guards - Server-Side Permission Checks

## Overview

Permission guards provide automatic permission checking at the middleware and Server Component level, eliminating the need for manual permission checks in every component.

## How It Works

### 1. Middleware Layer
The middleware (`middleware.ts`) extracts the user's role from the JWT token and passes it via headers to Server Components.

```typescript
// middleware.ts automatically:
// 1. Checks authentication
// 2. Extracts user role from JWT
// 3. Passes role via x-user-role header
// 4. Passes user ID via x-user-id header
```

### 2. Server Component Guards
Use permission guards in your Server Components to automatically enforce permissions.

## Usage

### Automatic Route-Based Permissions

```typescript
// app/(dashboard)/dashboard/fields/page.tsx
import { requireRoutePermissions } from "@/lib/permission-guards";

export default async function FieldsPage() {
  // Automatically checks permissions based on route
  // Redirects to /dashboard if user lacks required permissions
  await requireRoutePermissions("/dashboard/fields");

  // Rest of your component
  return <FieldsList />;
}
```

### Manual Permission Requirements

```typescript
// app/(dashboard)/dashboard/users/page.tsx
import { requirePermissions } from "@/lib/permission-guards";

export default async function UsersPage() {
  // Require specific permissions
  await requirePermissions(["users.read", "users.manage_roles"]);

  // Only users with BOTH permissions can access this page
  return <UsersList />;
}
```

### Conditional Rendering Based on Permissions

```typescript
// app/(dashboard)/dashboard/fields/page.tsx
import { userHasPermission, getUserRole } from "@/lib/permission-guards";

export default async function FieldsPage() {
  const canCreate = await userHasPermission("fields.create");
  const canDelete = await userHasPermission("fields.delete");
  const userRole = getUserRole();

  return (
    <div>
      <h1>Fields</h1>
      {canCreate && <CreateFieldButton />}
      <FieldsList canDelete={canDelete} />
      <p>Your role: {userRole}</p>
    </div>
  );
}
```

### In Server Actions

```typescript
// actions/field.actions.ts
import { getUserRole } from "@/lib/permission-guards";
import { hasPermission } from "@/lib/permissions";

export async function deleteField(id: string) {
  const userRole = getUserRole();
  
  if (!userRole) {
    return { success: false, error: "Unauthorized" };
  }

  const canDelete = await hasPermission(userRole, "fields.delete");
  
  if (!canDelete) {
    return { success: false, error: "Insufficient permissions" };
  }

  // Proceed with deletion
  await prisma.field.delete({ where: { id } });
  return { success: true };
}
```

## Available Functions

### `requirePermissions(permissions, redirectTo?)`
Enforces that the user has ANY of the specified permissions. Redirects if not authorized.

**Parameters:**
- `permissions: string[]` - Array of required permission names
- `redirectTo?: string` - Redirect path on failure (default: "/dashboard")

**Example:**
```typescript
await requirePermissions(["fields.create", "fields.update"]);
```

### `requireRoutePermissions(pathname)`
Automatically checks permissions based on route configuration.

**Parameters:**
- `pathname: string` - The current route pathname

**Example:**
```typescript
await requireRoutePermissions("/dashboard/users");
```

### `getUserRole()`
Gets the current user's role from headers.

**Returns:** `Promise<UserRole | null>`

**Example:**
```typescript
const role = await getUserRole();
if (role === "OWNER") {
  // Show admin features
}
```

### `getUserId()`
Gets the current user's ID from headers.

**Returns:** `Promise<string | null>`

**Example:**
```typescript
const userId = await getUserId();
const userActivities = await getActivitiesByUser(userId);
```

### `userHasPermission(permissionName)`
Checks if the current user has a specific permission.

**Parameters:**
- `permissionName: string` - The permission to check

**Returns:** `Promise<boolean>`

**Example:**
```typescript
const canExport = await userHasPermission("reports.export");
```

## Route-Permission Mappings

Defined in `lib/route-permissions.ts`:

```typescript
export const routePermissions = {
  "/dashboard/fields": ["fields.read"],
  "/dashboard/fields/new": ["fields.create"],
  "/dashboard/fields/[id]/edit": ["fields.update"],
  // ... more mappings
};
```

### Adding New Route Permissions

1. Open `lib/route-permissions.ts`
2. Add your route mapping:
```typescript
"/dashboard/my-feature": ["my-feature.read"],
"/dashboard/my-feature/new": ["my-feature.create"],
```

## Best Practices

1. **Use `requireRoutePermissions()` by default** - It's the simplest and most maintainable approach
2. **Use `requirePermissions()` for custom logic** - When you need specific permission combinations
3. **Use `userHasPermission()` for conditional rendering** - Show/hide UI elements based on permissions
4. **Always check permissions in Server Actions** - Even if the UI is hidden, users can still call Server Actions directly
5. **Keep route mappings up to date** - When adding new routes, add corresponding permission mappings

## Security Notes

- ✅ Permissions are checked server-side, not client-side
- ✅ User role is extracted from JWT token, not user input
- ✅ Middleware runs on every request before Server Components
- ✅ Headers are set by middleware, not by client
- ✅ Server Actions should still validate permissions independently

## Example: Complete Protected Page

```typescript
// app/(dashboard)/dashboard/fields/page.tsx
import { requireRoutePermissions, userHasPermission } from "@/lib/permission-guards";
import { getFields } from "@/actions/field.actions";
import { FieldsList } from "@/components/fields/fields-list";
import { CreateFieldButton } from "@/components/fields/create-field-button";

export default async function FieldsPage() {
  // Enforce permissions at page level
  await requireRoutePermissions("/dashboard/fields");

  // Check specific permissions for conditional features
  const canCreate = await userHasPermission("fields.create");
  const canDelete = await userHasPermission("fields.delete");

  // Fetch data (already authorized)
  const fields = await getFields();

  return (
    <div>
      <div className="flex justify-between">
        <h1>Fields</h1>
        {canCreate && <CreateFieldButton />}
      </div>
      <FieldsList fields={fields} canDelete={canDelete} />
    </div>
  );
}
```

This approach ensures:
- ✅ Page is protected by permissions
- ✅ UI adapts based on user permissions
- ✅ No manual permission checks needed in most cases
- ✅ Clean, maintainable code
