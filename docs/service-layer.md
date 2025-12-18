# Service Layer Documentation

> ⚠️ **DEPRECATED - Now Using Clean Architecture**
> 
> The service layer pattern described in this document has been replaced with Clean Architecture.
> See the updated architecture below.

## New Architecture (Clean Architecture)

The project has been fully refactored from the old service layer to Clean Architecture pattern.

### Current Structure

```
src/core/domain/              → Business rules & entities
src/core/application/         → Use cases & business logic
src/infrastructure/           → Database, HTTP, external services
src/config/di-container.ts    → Dependency injection
```

### Pattern Comparison

**Old Pattern (Deprecated):**
```
Server Actions → Services → Prisma
```

**New Pattern (Current):**
```
Server Actions → Use Cases → Repositories → Prisma
```

## Migration Summary

**What Changed:**
- ✅ `lib/services/` → Deleted (replaced by use cases)
- ✅ `actions/` → Moved to `src/infrastructure/http/actions/`
- ✅ Business logic → Now in `src/core/application/use-cases/`
- ✅ Data access → Now in `src/infrastructure/database/prisma/repositories/`

## New Documentation

For current architecture patterns, see:
- Project README
- `docs/clean-architecture.md`
- Source code in `src/` directory

## All Modules Refactored

All modules now follow Clean Architecture:
- Field ✅
- Crop ✅
- Planting ✅
- Inventory ✅
- User ✅
- Auth ✅

---

**Note:** This file is kept for historical reference. All new development should follow Clean Architecture patterns.
