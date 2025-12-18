# Farm Management System - Documentation

This directory contains all the documentation for the Farm Management System project.

## 📚 Documentation Files

### 1. [clean-architecture.md](./clean-architecture.md)
**✨ CURRENT - Clean Architecture implementation guide**

Covers the complete architectural refactor to Clean Architecture pattern.

### 2. [functional-requirements.md](./functional-requirements.md)
**Comprehensive functional requirements specification**

Covers:
- User roles and permissions
- All core modules
- MVP phased approach
- Technical stack overview
- Data models and relationships

### 3. [technical-specification.md](./technical-specification.md)
**Detailed technical architecture and implementation guide**

Covers:
- Technology stack with dependencies
- Next.js 15 features explained
- Database schema (Prisma)
- Best practices and patterns

### 4. [next-js-15-features-guide.md](./next-js-15-features-guide.md)
**Interview preparation guide for Next.js 15 features**

Covers:
- Server Components explained with examples
- Server Actions with code samples
- Streaming with Suspense
- Interview Q&A talking points

### 5. [permissions-system.md](./permissions-system.md) & [permission-guards.md](./permission-guards.md)
**Role-based access control documentation**

### 6. ~~service-layer.md~~ *(DEPRECATED)*
**Replaced by Clean Architecture** - See clean-architecture.md

## 🎯 Quick Reference

### For Understanding Current Architecture
1. Read [clean-architecture.md](./clean-architecture.md) for current patterns ✨
2. Check source code in `src/` directory
3. Review DI container in `src/config/di-container.ts`

### For Interview Preparation
1. Read [next-js-15-features-guide.md](./next-js-15-features-guide.md)
2. Review [technical-specification.md](./technical-specification.md)
3. Understand Clean Architecture benefits from [clean-architecture.md](./clean-architecture.md)

## 📁 Project Structure

```
src/
├── core/
│   ├── domain/              # Business rules, entities, constants
│   ├── application/         # Use cases, DTOs, interfaces
│   └── shared/              # Result monad, shared types
├── infrastructure/
│   ├── database/prisma/     # Repositories, mappers
│   ├── http/                # Server Actions, schemas
│   └── auth/                # Auth service
└── config/
    └── di-container.ts      # Dependency injection
```

## 🚀 Current Status

**✅ PRODUCTION READY - All Modules Complete**

**Completed:**
- ✅ Clean Architecture refactor (6/6 modules)
- ✅ Field management
- ✅ Crop management
- ✅ Planting with harvest
- ✅ Inventory & stock management
- ✅ User & role management
- ✅ Authentication & authorization
- ✅ Constants consolidation
- ✅ Zod schema centralization

**Architecture Benefits:**
- Framework independence
- Testable business logic
- Type-safe error handling
- Clear separation of concerns
- Scalable and maintainable

## 📝 Notes

All documentation files are in Markdown format (.md) and can be:
- Viewed in any text editor
- Rendered beautifully in VS Code
- Committed to version control

**Last Updated:** December 19, 2024
