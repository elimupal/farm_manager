/**
 * Authenticate user with email and password
 * Infrastructure service handles password verification
 */

import { AuthService } from '@/infrastructure/auth/auth.service';
import { Result } from '@/core/shared';
import { ValidationError, NotFoundError } from '@/core/domain/errors';

export interface AuthenticateUserDto {
    email: string;
    password: string;
}

export interface AuthenticatedUserDto {
    id: string;
    email: string;
    name: string;
    role: string;
}

export class AuthenticateUserUseCase {
    constructor(private readonly authService: AuthService) { }

    async execute(dto: AuthenticateUserDto): Promise<Result<AuthenticatedUserDto, Error>> {
        try {
            // Validate input
            if (!dto.email || !dto.password) {
                return Result.fail(new ValidationError('Email and password are required'));
            }

            // Authenticate via infrastructure service
            const authenticatedUser = await this.authService.authenticate({
                email: dto.email,
                password: dto.password,
            });

            if (!authenticatedUser) {
                return Result.fail(new ValidationError('Invalid credentials'));
            }

            return Result.ok(authenticatedUser);
        } catch (error) {
            return Result.fail(error as Error);
        }
    }
}
