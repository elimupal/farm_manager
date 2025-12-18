/**
 * Authentication Service
 * Infrastructure-level service for password verification
 * Works with Prisma User type (includes password)
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

export interface AuthCredentials {
    email: string;
    password: string;
}

export interface AuthenticatedUser {
    id: string;
    email: string;
    name: string;
    role: string;
}

export class AuthService {
    constructor(private readonly prisma: PrismaClient) { }

    /**
     * Authenticate user with email and password
     * Returns user data (without password) if successful
     */
    async authenticate(credentials: AuthCredentials): Promise<AuthenticatedUser | null> {
        // Find user with password
        const prismaUser = await this.prisma.user.findUnique({
            where: { email: credentials.email },
        });

        if (!prismaUser) {
            return null;
        }

        // Verify password
        const isValid = await bcrypt.compare(credentials.password, prismaUser.password);

        if (!isValid) {
            return null;
        }

        // Return authenticated user (without password)
        return {
            id: prismaUser.id,
            email: prismaUser.email,
            name: `${prismaUser.firstName} ${prismaUser.lastName}`,
            role: prismaUser.role,
        };
    }

    /**
     * Hash a password for storage
     */
    async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 10);
    }
}
