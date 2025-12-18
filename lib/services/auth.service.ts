import { BaseService } from "./base.service";
import { NotFoundError, ConflictError } from "@/core/domain/errors";
import bcrypt from "bcryptjs";
import type { User } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/core/domain/constants";

export interface RegisterUserData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
    role?: UserRole;
}

export type UpdateUserInput = Partial<Omit<RegisterUserData, "password">>;

/**
 * Authentication and user management service
 */
export class AuthService extends BaseService {
    /**
     * Verify user credentials
     */
    async verifyCredentials(
        email: string,
        password: string
    ): Promise<Omit<User, "password"> | null> {
        try {
            this.log("verifyCredentials", { email });

            const user = await this.db.user.findUnique({
                where: { email },
            });

            if (!user) {
                return null;
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return null;
            }

            // Return user without password
            const { password: _, ...userWithoutPassword } = user;
            return userWithoutPassword;
        } catch (error) {
            this.handleError(error);
        }
    }

    /**
     * Create a new user
     */
    async createUser(data: RegisterUserData): Promise<Omit<User, "password">> {
        try {
            this.log("createUser", { email: data.email });

            // Check if user already exists
            const existingUser = await this.db.user.findUnique({
                where: { email: data.email },
            });

            if (existingUser) {
                throw new ConflictError("User with this email already exists");
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(data.password, 10);

            // Create user
            const user = await this.db.user.create({
                data: {
                    ...data,
                    password: hashedPassword,
                    role: data.role || "WORKER",
                },
            });

            // Return user without password
            const { password: _, ...userWithoutPassword } = user;
            return userWithoutPassword;
        } catch (error) {
            this.handleError(error);
        }
    }

    /**
     * Get user by email
     */
    async getUserByEmail(email: string): Promise<User | null> {
        try {
            this.log("getUserByEmail", { email });

            return this.db.user.findUnique({
                where: { email },
            });
        } catch (error) {
            this.handleError(error);
        }
    }

    /**
     * Get user by ID
     */
    async getUserById(id: string): Promise<Omit<User, "password">> {
        try {
            this.log("getUserById", { id });

            const user = await this.db.user.findUnique({
                where: { id },
            });

            if (!user) {
                throw new NotFoundError("User", id);
            }

            const { password: _, ...userWithoutPassword } = user;
            return userWithoutPassword;
        } catch (error) {
            this.handleError(error);
        }
    }

    /**
     * Update user password
     */
    async updatePassword(userId: string, newPassword: string): Promise<void> {
        try {
            this.log("updatePassword", { userId });

            await this.checkExists(this.db.user, userId, "User");

            const hashedPassword = await bcrypt.hash(newPassword, 10);

            await this.db.user.update({
                where: { id: userId },
                data: { password: hashedPassword },
            });
        } catch (error) {
            this.handleError(error);
        }
    }

    /**
     * Update user profile
     */
    async updateUser(
        userId: string,
        data: UpdateUserInput
    ): Promise<Omit<User, "password">> {
        try {
            this.log("updateUser", { userId });

            await this.checkExists(this.db.user, userId, "User");

            const user = await this.db.user.update({
                where: { id: userId },
                data,
            });

            const { password: _, ...userWithoutPassword } = user;
            return userWithoutPassword;
        } catch (error) {
            this.handleError(error);
        }
    }

    /**
     * Get all users
     */
    async getAllUsers(): Promise<Omit<User, "password">[]> {
        try {
            this.log("getAllUsers");

            const users = await this.db.user.findMany({
                orderBy: { createdAt: "desc" },
            });

            return users.map(({ password: _, ...user }) => user);
        } catch (error) {
            this.handleError(error);
        }
    }
}

// Export singleton instance
export const authService = new AuthService();
