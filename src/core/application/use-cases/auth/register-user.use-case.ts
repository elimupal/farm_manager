/**
 * Register new user with hashed password
 *  Works at infrastructure level for password handling
 */

import { IUserRepository } from '@/core/application/ports/repositories';
import { AuthService } from '@/infrastructure/auth/auth.service';
import { User } from '@/core/domain/entities';
import { Result } from '@/core/shared';
import { ValidationError, ConflictError } from '@/core/domain/errors';
import { UserRole } from '@/core/domain/constants';
import { randomUUID } from 'crypto';

export interface RegisterUserDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role?: UserRole;
}

export class RegisterUserUseCase {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly authService: AuthService
    ) { }

    async execute(dto: RegisterUserDto): Promise<Result<any, Error>> {
        try {
            // Validate input
            if (!dto.email || !dto.password || !dto.firstName || !dto.lastName) {
                return Result.fail(new ValidationError('Email, password, first name, and last name are required'));
            }

            // Validate password strength
            if (dto.password.length < 8) {
                return Result.fail(new ValidationError('Password must be at least 8 characters'));
            }

            // Check if email already exists
            const existingUser = await this.userRepository.findByEmail(dto.email);
            if (existingUser) {
                return Result.fail(new ConflictError('Email already in use'));
            }

            // Hash password
            const hashedPassword = await this.authService.hashPassword(dto.password);

            // Create user via Prisma directly (bypassing domain entity since password isn't in domain)
            // This is acceptable for auth infrastructure concern
            const prismaUser = await (this.userRepository as any).prisma.user.create({
                data: {
                    id: randomUUID(),
                    email: dto.email,
                    password: hashedPassword,
                    firstName: dto.firstName,
                    lastName: dto.lastName,
                    phone: dto.phone,
                    role: dto.role || UserRole.WORKER,
                },
            });

            return Result.ok({
                id: prismaUser.id,
                email: prismaUser.email,
                name: `${dto.firstName} ${dto.lastName}`,
                role: prismaUser.role,
            });
        } catch (error) {
            return Result.fail(error as Error);
        }
    }
}
