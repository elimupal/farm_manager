// Consolidated User Use Cases
import { User } from '@/core/domain/entities';
import { IUserRepository } from '@/core/application/ports/repositories';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from '@/core/application/dtos';
import { Result } from '@/core/shared';
import { NotFoundError, ValidationError } from '@/core/domain/errors';

// Create User
export class CreateUserUseCase {
    constructor(private readonly userRepository: IUserRepository) { }

    async execute(dto: CreateUserDto): Promise<Result<UserResponseDto, Error>> {
        try {
            // Check if email already exists
            const existing = await this.userRepository.findByEmail(dto.email);
            if (existing) {
                return Result.fail(new ValidationError('Email already in use'));
            }

            const user = User.create({ id: crypto.randomUUID(), ...dto });
            await this.userRepository.save(user);
            return Result.ok(this.toDto(user));
        } catch (error) {
            return Result.fail(error as Error);
        }
    }

    private toDto(user: User): UserResponseDto {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            employeeStatus: user.employeeStatus,
            isActive: user.isActive,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
}

// Get Users
export class GetUsersUseCase {
    constructor(private readonly userRepository: IUserRepository) { }

    async executeAll(): Promise<Result<UserResponseDto[], Error>> {
        try {
            const users = await this.userRepository.findAll();
            return Result.ok(users.map(this.toDto));
        } catch (error) {
            return Result.fail(error as Error);
        }
    }

    async executeById(id: string): Promise<Result<UserResponseDto, Error>> {
        try {
            const user = await this.userRepository.findById(id);
            if (!user) return Result.fail(new NotFoundError('User', id));
            return Result.ok(this.toDto(user));
        } catch (error) {
            return Result.fail(error as Error);
        }
    }

    private toDto(user: User): UserResponseDto {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            employeeStatus: user.employeeStatus,
            isActive: user.isActive,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
}

// Update User
export class UpdateUserUseCase {
    constructor(private readonly userRepository: IUserRepository) { }

    async execute(id: string, dto: UpdateUserDto): Promise<Result<UserResponseDto, Error>> {
        try {
            const user = await this.userRepository.findById(id);
            if (!user) return Result.fail(new NotFoundError('User', id));

            let updated = user;
            if (dto.role) updated = updated.changeRole(dto.role);

            await this.userRepository.update(updated);
            return Result.ok(this.toDto(updated));
        } catch (error) {
            return Result.fail(error as Error);
        }
    }

    private toDto(user: User): UserResponseDto {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            employeeStatus: user.employeeStatus,
            isActive: user.isActive,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
}

// Deactivate User
export class DeactivateUserUseCase {
    constructor(private readonly userRepository: IUserRepository) { }

    async execute(id: string): Promise<Result<UserResponseDto, Error>> {
        try {
            const user = await this.userRepository.findById(id);
            if (!user) return Result.fail(new NotFoundError('User', id));

            const deactivated = user.deactivate();
            await this.userRepository.update(deactivated);
            return Result.ok(this.toDto(deactivated));
        } catch (error) {
            return Result.fail(error as Error);
        }
    }

    private toDto(user: User): UserResponseDto {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            employeeStatus: user.employeeStatus,
            isActive: user.isActive,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
}

// Delete User
export class DeleteUserUseCase {
    constructor(private readonly userRepository: IUserRepository) { }

    async execute(id: string): Promise<Result<void, Error>> {
        try {
            const exists = await this.userRepository.exists(id);
            if (!exists) return Result.fail(new NotFoundError('User', id));

            await this.userRepository.delete(id);
            return Result.ok(undefined);
        } catch (error) {
            return Result.fail(error as Error);
        }
    }
}
