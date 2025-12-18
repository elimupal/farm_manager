# Clean Architecture Restructure Plan

## Overview

Transform the Farm Manager project into a **scalable, maintainable, framework-agnostic** architecture following Clean Architecture principles.

## Core Principles

1. **Dependency Inversion**: Inner layers don't know about outer layers
2. **Framework Independence**: Business logic has no Next.js/Prisma imports
3. **Testability**: Core logic can be tested without DB/framework
4. **Replaceability**: Swap Prisma, Next.js, or UI with minimal changes

---

## New Folder Structure

```
farm_manager/
├── src/
│   ├── core/                          # ← BUSINESS LOGIC (Framework-agnostic)
│   │   ├── domain/                    # Entities & Business Rules
│   │   │   ├── entities/
│   │   │   │   ├── field.entity.ts
│   │   │   │   ├── crop.entity.ts
│   │   │   │   ├── user.entity.ts
│   │   │   │   └── planting.entity.ts
│   │   │   ├── value-objects/
│   │   │   │   ├── email.vo.ts
│   │   │   │   ├── area.vo.ts
│   │   │   │   └── coordinates.vo.ts
│   │   │   └── errors/
│   │   │       ├── domain-error.ts
│   │   │       ├── validation-error.ts
│   │   │       └── not-found-error.ts
│   │   │
│   │   ├── application/               # Use Cases (Business Operations)
│   │   │   ├── use-cases/
│   │   │   │   ├── field/
│   │   │   │   │   ├── create-field.use-case.ts
│   │   │   │   │   ├── update-field.use-case.ts
│   │   │   │   │   ├── delete-field.use-case.ts
│   │   │   │   │   └── get-fields.use-case.ts
│   │   │   │   ├── crop/
│   │   │   │   ├── planting/
│   │   │   │   └── inventory/
│   │   │   ├── ports/                 # Interfaces (Contracts)
│   │   │   │   ├── repositories/
│   │   │   │   │   ├── field.repository.ts
│   │   │   │   │   ├── crop.repository.ts
│   │   │   │   │   └── user.repository.ts
│   │   │   │   └── services/
│   │   │   │       ├── auth.service.ts
│   │   │   │       └── email.service.ts
│   │   │   └── dtos/                  # Data Transfer Objects
│   │   │       ├── create-field.dto.ts
│   │   │       └── field-response.dto.ts
│   │   │
│   │   └── shared/                    # Shared Utilities
│   │       ├── result.ts              # Result<T, Error> pattern
│   │       ├── either.ts              # Either<Left, Right>
│   │       └── types.ts
│   │
│   ├── infrastructure/                # ← FRAMEWORK/LIBRARY CODE
│   │   ├── database/
│   │   │   ├── prisma/
│   │   │   │   ├── schema.prisma
│   │   │   │   ├── client.ts
│   │   │   │   └── repositories/      # Prisma implementations
│   │   │   │       ├── prisma-field.repository.ts
│   │   │   │       ├── prisma-crop.repository.ts
│   │   │   │       └── prisma-user.repository.ts
│   │   │   └── migrations/
│   │   │
│   │   ├── auth/                      # NextAuth implementation
│   │   │   ├── next-auth.config.ts
│   │   │   └── providers/
│   │   │
│   │   ├── http/                      # Next.js specific
│   │   │   ├── actions/               # Server Actions (adapters)
│   │   │   │   ├── field.actions.ts
│   │   │   │   └── crop.actions.ts
│   │   │   └── middleware.ts
│   │   │
│   │   └── services/                  # External service implementations
│   │       └── email/
│   │
│   ├── presentation/                  # ← UI LAYER
│   │   ├── app/                       # Next.js app directory
│   │   ├── components/
│   │   ├── hooks/
│   │   └── store/                     # Zustand stores
│   │
│   └── config/                        # Configuration
│       ├── di-container.ts            # Dependency Injection
│       └── env.ts
│
├── tests/
│   ├── unit/                          # Core logic tests (no DB)
│   ├── integration/                   # Use cases + DB
│   └── e2e/                          # Full stack tests
│
└── docs/
```

---

## Layer Responsibilities

### **1. Core/Domain Layer** 🎯

**Purpose**: Pure business logic, no framework dependencies

**Contains**:
- **Entities**: Business objects with identity (Field, Crop, User)
- **Value Objects**: Immutable values (Email, Coordinates, Area)
- **Domain Events**: Business events (FieldCreated, PlantingHarvested)
- **Business Rules**: Validation, invariants

**Rules**:
- ✅ NO imports from infrastructure/presentation
- ✅ NO framework dependencies (Next.js, Prisma, React)
- ✅ 100% testable without DB or HTTP

**Example Entity**:
```typescript
// src/core/domain/entities/field.entity.ts
import { Area } from '../value-objects/area.vo';
import { DomainError } from '../errors/domain-error';

export type FieldType = 'GREENHOUSE' | 'OPEN_FIELD' | 'SCREENHOUSE';
export type FieldStatus = 'ACTIVE' | 'FALLOW' | 'UNDER_PREPARATION';

export class Field {
  private constructor(
    public readonly id: string,
    public readonly farmId: string,
    public readonly name: string,
    public readonly fieldType: FieldType,
    public readonly area: Area,
    public readonly status: FieldStatus,
    public readonly location?: string,
    public readonly soilType?: string,
  ) {}

  static create(props: {
    id: string;
    farmId: string;
    name: string;
    fieldType: FieldType;
    area: number;
    status?: FieldStatus;
    location?: string;
    soilType?: string;
  }): Field {
    // Business validation
    if (!props.name || props.name.length < 3) {
      throw new DomainError('Field name must be at least 3 characters');
    }

    const area = Area.create(props.area);

    return new Field(
      props.id,
      props.farmId,
      props.name,
      props.fieldType,
      area,
      props.status || 'ACTIVE',
      props.location,
      props.soilType
    );
  }

  // Business methods
  changeName(newName: string): Field {
    if (!newName || newName.length < 3) {
      throw new DomainError('Field name must be at least 3 characters');
    }
    return new Field(
      this.id,
      this.farmId,
      newName,
      this.fieldType,
      this.area,
      this.status,
      this.location,
      this.soilType
    );
  }

  canBeDeleted(): boolean {
    // Business rule: can't delete active fields
    return this.status !== 'ACTIVE';
  }
}
```

### **2. Core/Application Layer** ⚙️

**Purpose**: Orchestrate business operations (use cases)

**Contains**:
- **Use Cases**: Application-specific business flows
- **Ports (Interfaces)**: Contracts for infrastructure
- **DTOs**: Data structures for communication

**Rules**:
- ✅ Can import from Domain layer
- ✅ Defines interfaces (ports) for infrastructure
- ✅ NO concrete implementations
- ✅ NO framework code

**Example Use Case**:
```typescript
// src/core/application/use-cases/field/create-field.use-case.ts
import { Field } from '@/core/domain/entities/field.entity';
import { IFieldRepository } from '@/core/application/ports/repositories/field.repository';
import { IFarmRepository } from '@/core/application/ports/repositories/farm.repository';
import { Result } from '@/core/shared/result';
import { CreateFieldDto } from '@/core/application/dtos/create-field.dto';

export class CreateFieldUseCase {
  constructor(
    private readonly fieldRepository: IFieldRepository,
    private readonly farmRepository: IFarmRepository
  ) {}

  async execute(dto: CreateFieldDto): Promise<Result<Field, Error>> {
    try {
      // 1. Validate farm exists
      const farm = await this.farmRepository.findById(dto.farmId);
      if (!farm) {
        return Result.fail(new Error('Farm not found'));
      }

      // 2. Check farm capacity
      const totalArea = await this.fieldRepository.getTotalArea(dto.farmId);
      if (totalArea + dto.area > farm.totalArea) {
        return Result.fail(new Error('Exceeds farm capacity'));
      }

      // 3. Create entity (business validation happens here)
      const field = Field.create({
        id: crypto.randomUUID(),
        farmId: dto.farmId,
        name: dto.name,
        fieldType: dto.fieldType,
        area: dto.area,
        status: dto.status,
        location: dto.location,
        soilType: dto.soilType,
      });

      // 4. Persist
      await this.fieldRepository.save(field);

      return Result.ok(field);
    } catch (error) {
      return Result.fail(error as Error);
    }
  }
}
```

**Example Repository Interface (Port)**:
```typescript
// src/core/application/ports/repositories/field.repository.ts
import { Field } from '@/core/domain/entities/field.entity';

export interface IFieldRepository {
  findById(id: string): Promise<Field | null>;
  findByFarm(farmId: string): Promise<Field[]>;
  save(field: Field): Promise<void>;
  update(field: Field): Promise<void>;
  delete(id: string): Promise<void>;
  getTotalArea(farmId: string): Promise<number>;
}
```

### **3. Infrastructure Layer** 🔧

**Purpose**: Implement ports with actual frameworks/libraries

**Contains**:
- **Repository Implementations**: Prisma, TypeORM, etc.
- **Auth Implementations**: NextAuth, Passport, etc.
- **External Services**: Email, SMS, etc.
- **Server Actions**: Next.js adapters

**Rules**:
- ✅ Implements interfaces from Application layer
- ✅ Can use ANY framework/library
- ✅ Easily swappable

**Example Repository Implementation**:
```typescript
// src/infrastructure/database/prisma/repositories/prisma-field.repository.ts
import { IFieldRepository } from '@/core/application/ports/repositories/field.repository';
import { Field } from '@/core/domain/entities/field.entity';
import { prisma } from '../client';

export class PrismaFieldRepository implements IFieldRepository {
  async findById(id: string): Promise<Field | null> {
    const record = await prisma.field.findUnique({ where: { id } });
    if (!record) return null;
    return this.toDomain(record);
  }

  async findByFarm(farmId: string): Promise<Field[]> {
    const records = await prisma.field.findMany({ where: { farmId } });
    return records.map(this.toDomain);
  }

  async save(field: Field): Promise<void> {
    await prisma.field.create({
      data: this.toPersistence(field),
    });
  }

  async update(field: Field): Promise<void> {
    await prisma.field.update({
      where: { id: field.id },
      data: this.toPersistence(field),
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.field.delete({ where: { id } });
  }

  async getTotalArea(farmId: string): Promise<number> {
    const result = await prisma.field.aggregate({
      where: { farmId },
      _sum: { area: true },
    });
    return result._sum.area || 0;
  }

  // Mappers
  private toDomain(record: any): Field {
    return Field.create({
      id: record.id,
      farmId: record.farmId,
      name: record.name,
      fieldType: record.fieldType,
      area: record.area,
      status: record.status,
      location: record.location,
      soilType: record.soilType,
    });
  }

  private toPersistence(field: Field) {
    return {
      id: field.id,
      farmId: field.farmId,
      name: field.name,
      fieldType: field.fieldType,
      area: field.area.value,
      status: field.status,
      location: field.location,
      soilType: field.soilType,
    };
  }
}
```

**Example Server Action (Adapter)**:
```typescript
// src/infrastructure/http/actions/field.actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { container } from '@/config/di-container';
import { CreateFieldUseCase } from '@/core/application/use-cases/field/create-field.use-case';

export async function createFieldAction(formData: FormData) {
  const useCase = container.get<CreateFieldUseCase>('CreateFieldUseCase');

  const result = await useCase.execute({
    farmId: formData.get('farmId') as string,
    name: formData.get('name') as string,
    fieldType: formData.get('fieldType') as any,
    area: parseFloat(formData.get('area') as string),
  });

  if (result.isFailure) {
    return { success: false, error: result.error.message };
  }

  revalidatePath('/fields');
  return { success: true, data: result.value };
}
```

### **4. Presentation Layer** 🎨

**Purpose**: UI and user interaction

**Contains**:
- Next.js pages/components
- React hooks
- Zustand stores
- Forms

**Rules**:
- ✅ Only talks to Application layer (use cases)
- ✅ Never imports from Infrastructure
- ✅ Framework-specific code OK here

---

## Dependency Injection Setup

```typescript
// src/config/di-container.ts
import { Container } from 'inversify';
import { IFieldRepository } from '@/core/application/ports/repositories/field.repository';
import { PrismaFieldRepository } from '@/infrastructure/database/prisma/repositories/prisma-field.repository';
import { CreateFieldUseCase } from '@/core/application/use-cases/field/create-field.use-case';

const container = new Container();

// Repositories
container.bind<IFieldRepository>('IFieldRepository').to(PrismaFieldRepository);

// Use Cases
container.bind<CreateFieldUseCase>('CreateFieldUseCase').toDynamicValue((context) => {
  return new CreateFieldUseCase(
    context.container.get('IFieldRepository'),
    context.container.get('IFarmRepository')
  );
});

export { container };
```

---

## Benefits

### **1. Database Independence** 🔄

Want to switch from Prisma to TypeORM?

```typescript
// Just create new implementation
export class TypeOrmFieldRepository implements IFieldRepository {
  // Same interface, different implementation
}

// Update DI container
container.bind<IFieldRepository>('IFieldRepository').to(TypeOrmFieldRepository);

// ✅ DONE! Business logic unchanged
```

### **2. Framework Independence** 🚀

Want to switch from Next.js to Express?

- ✅ Core business logic: NO changes
- ✅ Use cases: NO changes  
- ✅ Only change: Infrastructure/Presentation layers

### **3. Testability** ✅

```typescript
// Test use case without DB
const mockFieldRepo = {
  save: jest.fn(),
  findById: jest.fn(),
};

const useCase = new CreateFieldUseCase(mockFieldRepo, mockFarmRepo);
// Test pure business logic!
```

---

## Migration Strategy

### Phase 1: Setup Structure
1. Create new folder structure
2. Setup DI container
3. Create base interfaces

### Phase 2: Migrate Domain
1. Convert Prisma types to Entities
2. Create Value Objects
3. Move business rules to entities

### Phase 3: Migrate Application
1. Create repository interfaces
2. Convert services to use cases
3. Create DTOs

### Phase 4: Migrate Infrastructure
1. Implement Prisma repositories
2. Update Server Actions
3. Wire up DI container

### Phase 5: Update Presentation
1. Update components to use new actions
2. Migrate Zustand stores if needed

---

## Example: Before vs After

### Before (Current)
```typescript
// actions/field.actions.ts - Business logic mixed with framework
export async function createField(data) {
  const session = await auth(); // Next.js
  const field = await prisma.field.create({ data }); // Prisma
  revalidatePath('/fields'); // Next.js
  return field;
}
```

### After (Clean)
```typescript
// core/application/use-cases - Pure business logic
export class CreateFieldUseCase {
  async execute(dto) {
    const field = Field.create(dto); // Domain logic
    await this.repository.save(field); // Port
    return Result.ok(field);
  }
}

// infrastructure/http/actions - Framework adapter
export async function createFieldAction(formData) {
  const useCase = container.get('CreateFieldUseCase');
  const result = await useCase.execute(dto);
  revalidatePath('/fields');
  return result;
}
```

---

## Next Steps

1. Review and approve this architecture
2. Start with Field module as proof of concept
3. Migrate other modules progressively
4. Add comprehensive tests
5. Document patterns for team

**Ready to implement?** 🚀
