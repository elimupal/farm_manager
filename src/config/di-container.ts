import { prisma } from '@/infrastructure/database/prisma/client';
import {
    PrismaFieldRepository,
    PrismaFarmRepository,
    PrismaCropRepository,
    PrismaPlantingRepository,
    PrismaProductRepository,
    PrismaUserRepository
} from '@/infrastructure/database/prisma/repositories';
import {
    CreateFieldUseCase,
    GetFieldsUseCase,
    UpdateFieldUseCase,
    DeleteFieldUseCase,
} from '@/core/application/use-cases/field';
import {
    CreateCropUseCase,
    GetCropsUseCase,
    UpdateCropUseCase,
    DeleteCropUseCase,
} from '@/core/application/use-cases/crop';
import {
    CreatePlantingUseCase,
    GetPlantingsUseCase,
    UpdatePlantingUseCase,
    HarvestPlantingUseCase,
    DeletePlantingUseCase,
} from '@/core/application/use-cases/planting';
import {
    CreateProductUseCase,
    GetProductsUseCase,
    UpdateProductUseCase,
    AdjustStockUseCase,
    DeleteProductUseCase,
} from '@/core/application/use-cases/inventory';
import {
    CreateUserUseCase,
    GetUsersUseCase,
    UpdateUserUseCase,
    DeactivateUserUseCase,
    DeleteUserUseCase,
} from '@/core/application/use-cases/user';
import {
    AuthenticateUserUseCase,
    RegisterUserUseCase,
} from '@/core/application/use-cases/auth';
import { AuthService } from '@/infrastructure/auth/auth.service';

class DIContainer {
    // Repositories (Singleton)
    private _fieldRepository?: PrismaFieldRepository;
    private _farmRepository?: PrismaFarmRepository;
    private _cropRepository?: PrismaCropRepository;
    private _plantingRepository?: PrismaPlantingRepository;
    private _productRepository?: PrismaProductRepository;
    private _userRepository?: PrismaUserRepository;

    get fieldRepository(): PrismaFieldRepository {
        if (!this._fieldRepository) {
            this._fieldRepository = new PrismaFieldRepository(prisma);
        }
        return this._fieldRepository;
    }

    get farmRepository(): PrismaFarmRepository {
        if (!this._farmRepository) {
            this._farmRepository = new PrismaFarmRepository(prisma);
        }
        return this._farmRepository;
    }

    get cropRepository(): PrismaCropRepository {
        if (!this._cropRepository) {
            this._cropRepository = new PrismaCropRepository(prisma);
        }
        return this._cropRepository;
    }

    get plantingRepository(): PrismaPlantingRepository {
        if (!this._plantingRepository) {
            this._plantingRepository = new PrismaPlantingRepository(prisma);
        }
        return this._plantingRepository;
    }

    // Field Use Cases
    get createFieldUseCase(): CreateFieldUseCase {
        return new CreateFieldUseCase(this.fieldRepository, this.farmRepository);
    }

    get getFieldsUseCase(): GetFieldsUseCase {
        return new GetFieldsUseCase(this.fieldRepository);
    }

    get updateFieldUseCase(): UpdateFieldUseCase {
        return new UpdateFieldUseCase(this.fieldRepository, this.farmRepository);
    }

    get deleteFieldUseCase(): DeleteFieldUseCase {
        return new DeleteFieldUseCase(this.fieldRepository);
    }

    // Crop Use Cases
    get createCropUseCase(): CreateCropUseCase {
        return new CreateCropUseCase(this.cropRepository);
    }

    get getCropsUseCase(): GetCropsUseCase {
        return new GetCropsUseCase(this.cropRepository);
    }

    get updateCropUseCase(): UpdateCropUseCase {
        return new UpdateCropUseCase(this.cropRepository);
    }

    get deleteCropUseCase(): DeleteCropUseCase {
        return new DeleteCropUseCase(this.cropRepository);
    }

    // Planting Use Cases
    get createPlantingUseCase(): CreatePlantingUseCase {
        return new CreatePlantingUseCase(this.plantingRepository, this.fieldRepository, this.cropRepository);
    }

    get getPlantingsUseCase(): GetPlantingsUseCase {
        return new GetPlantingsUseCase(this.plantingRepository);
    }

    get updatePlantingUseCase(): UpdatePlantingUseCase {
        return new UpdatePlantingUseCase(this.plantingRepository);
    }

    get harvestPlantingUseCase(): HarvestPlantingUseCase {
        return new HarvestPlantingUseCase(this.plantingRepository);
    }

    get deletePlantingUseCase(): DeletePlantingUseCase {
        return new DeletePlantingUseCase(this.plantingRepository);
    }

    get productRepository(): PrismaProductRepository {
        if (!this._productRepository) {
            this._productRepository = new PrismaProductRepository(prisma);
        }
        return this._productRepository;
    }

    // Product/Inventory Use Cases
    get createProductUseCase(): CreateProductUseCase {
        return new CreateProductUseCase(this.productRepository);
    }

    get getProductsUseCase(): GetProductsUseCase {
        return new GetProductsUseCase(this.productRepository);
    }

    get updateProductUseCase(): UpdateProductUseCase {
        return new UpdateProductUseCase(this.productRepository);
    }

    get adjustStockUseCase(): AdjustStockUseCase {
        return new AdjustStockUseCase(this.productRepository);
    }

    get deleteProductUseCase(): DeleteProductUseCase {
        return new DeleteProductUseCase(this.productRepository);
    }

    get userRepository(): PrismaUserRepository {
        if (!this._userRepository) {
            this._userRepository = new PrismaUserRepository(prisma);
        }
        return this._userRepository;
    }

    // User Use Cases
    get createUserUseCase(): CreateUserUseCase {
        return new CreateUserUseCase(this.userRepository);
    }

    get getUsersUseCase(): GetUsersUseCase {
        return new GetUsersUseCase(this.userRepository);
    }

    get updateUserUseCase(): UpdateUserUseCase {
        return new UpdateUserUseCase(this.userRepository);
    }

    get deactivateUserUseCase(): DeactivateUserUseCase {
        return new DeactivateUserUseCase(this.userRepository);
    }

    get deleteUserUseCase(): DeleteUserUseCase {
        return new DeleteUserUseCase(this.userRepository);
    }

    // Auth Service (Singleton)
    private _authService?: AuthService;

    get authService(): AuthService {
        if (!this._authService) {
            this._authService = new AuthService(prisma);
        }
        return this._authService;
    }

    // Auth Use Cases
    get authenticateUserUseCase(): AuthenticateUserUseCase {
        return new AuthenticateUserUseCase(this.authService);
    }

    get registerUserUseCase(): RegisterUserUseCase {
        return new RegisterUserUseCase(this.userRepository, this.authService);
    }
}

// Export singleton container
export const container = new DIContainer();
