# Permissions System

## Overview

The Farm Management System implements a comprehensive Role-Based Access Control (RBAC) system with granular permissions.

## Database Schema

### Permission Model
- `id`: Unique identifier
- `name`: Permission name (e.g., "fields.create")
- `description`: Human-readable description
- `resource`: Resource type (e.g., "fields", "users", "crops")
- `action`: Action type (e.g., "create", "read", "update", "delete")

### RolePermission Model
- `id`: Unique identifier
- `role`: User role (OWNER, MANAGER, SUPERVISOR, WORKER, AGRONOMIST)
- `permissionId`: Reference to Permission
- Unique constraint on `[role, permissionId]`

## Roles & Permissions

### OWNER (Full Access)
- **All permissions** across all resources
- Can manage users, roles, and settings
- Total: 31 permissions

### MANAGER (Administrative Access)
- Most permissions except user management and settings
- Can manage fields, crops, plantings, inventory, and activities
- Can view reports and analytics
- Total: 26 permissions

### SUPERVISOR (Operational Management)
- Can manage fields, plantings, and activities
- Can apply inventory products
- Read-only access to crops and users
- Total: 12 permissions

### WORKER (Basic Access)
- Read-only access to most resources
- Can create and view activities
- Total: 6 permissions

### AGRONOMIST (Specialized Access)
- Specialized access for crop and planting management
- Can manage crops and plantings
- Can apply inventory products
- Can view analytics
- Total: 13 permissions

## Permission Naming Convention

Permissions follow the format: `resource.action`

**Examples:**
- `fields.create` - Create new fields
- `users.delete` - Delete users
- `inventory.apply` - Apply inventory products
- `reports.analytics` - View analytics

## Resources

1. **fields** - Farm fields management
2. **crops** - Crop catalog management
3. **plantings** - Planting records management
4. **inventory** - Inventory and products management
5. **activities** - Activity logging
6. **users** - User management
7. **reports** - Reports and analytics
8. **settings** - System settings

## Actions

- `create` - Create new records
- `read` - View/read records
- `update` - Modify existing records
- `delete` - Delete records
- `apply` - Apply inventory products
- `manage_roles` - Manage user roles
- `view` - View reports/settings
- `export` - Export data
- `analytics` - View analytics

## Helper Functions

Located in `lib/permissions.ts`:

### `hasPermission(role, permissionName)`
Check if a role has a specific permission.

```typescript
const canCreate = await hasPermission("WORKER", "fields.create");
// Returns: false
```

### `getRolePermissions(role)`
Get all permissions for a role.

```typescript
const permissions = await getRolePermissions("MANAGER");
// Returns: ["fields.create", "fields.read", ...]
```

### `hasAnyPermission(role, permissionNames)`
Check if a role has any of the specified permissions.

```typescript
const hasAccess = await hasAnyPermission("WORKER", ["fields.create", "fields.read"]);
// Returns: true (has fields.read)
```

### `hasAllPermissions(role, permissionNames)`
Check if a role has all of the specified permissions.

```typescript
const hasAll = await hasAllPermissions("OWNER", ["fields.create", "fields.delete"]);
// Returns: true
```

### `canPerformAction(role, resource, action)`
Check if a role can perform an action on a resource.

```typescript
const canDelete = await canPerformAction("SUPERVISOR", "fields", "delete");
// Returns: false
```

### `getPermissionsByResource(role)`
Get permissions grouped by resource.

```typescript
const grouped = await getPermissionsByResource("MANAGER");
// Returns: { fields: ["create", "read", "update", "delete"], ... }
```

## Usage Examples

### In Server Actions

```typescript
import { auth } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";

export async function deleteField(id: string) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  const canDelete = await hasPermission(session.user.role, "fields.delete");
  if (!canDelete) {
    return { success: false, error: "Insufficient permissions" };
  }

  // Proceed with deletion
  await prisma.field.delete({ where: { id } });
  return { success: true };
}
```

### In Middleware

```typescript
import { hasPermission } from "@/lib/permissions";

// Check permissions in middleware
const userRole = session.user.role;
const canAccess = await hasPermission(userRole, "users.read");
```

### In Components

```typescript
"use client";

import { useSession } from "next-auth/react";
import { hasPermission } from "@/lib/permissions";

export function FieldActions() {
  const { data: session } = useSession();
  const [canDelete, setCanDelete] = useState(false);

  useEffect(() => {
    if (session?.user?.role) {
      hasPermission(session.user.role, "fields.delete")
        .then(setCanDelete);
    }
  }, [session]);

  return (
    <>
      {canDelete && <DeleteButton />}
    </>
  );
}
```

## Seeding

Permissions are automatically seeded when running:
```bash
npm run db:seed
```

This creates:
- 31 permissions across all resources
- 91 role-permission mappings

## Extending the System

### Adding New Permissions

1. Add to `prisma/seeders/permissions.js`:
```javascript
{
  name: "resource.action",
  description: "Description",
  resource: "resource",
  action: "action"
}
```

2. Add to role mappings in `prisma/seeders/role-permissions.js`:
```javascript
OWNER: [
  // ... existing permissions
  "resource.action",
],
```

3. Re-run seeders:
```bash
npm run db:seed
```

## Best Practices

1. **Always check permissions** in Server Actions before performing sensitive operations
2. **Use descriptive permission names** following the `resource.action` convention
3. **Group related permissions** by resource for easier management
4. **Test permission checks** for each role
5. **Document new permissions** when adding them
6. **Use helper functions** instead of direct database queries
7. **Cache permission checks** when possible to improve performance
