/**
 * User Validation Schemas
 * Zod schemas for validating user-related HTTP inputs
 */

import { z } from 'zod';
import { UserRole, EmployeeStatus, USER_CONSTRAINTS } from '@/core/domain/constants';

/**
 * Schema for creating a new user
 * Aligns with CreateUserDto
 */
export const createUserSchema = z.object({
    name: z.string()
        .min(USER_CONSTRAINTS.NAME_MIN_LENGTH, `Name must be at least ${USER_CONSTRAINTS.NAME_MIN_LENGTH} characters`)
        .max(USER_CONSTRAINTS.NAME_MAX_LENGTH, `Name cannot exceed ${USER_CONSTRAINTS.NAME_MAX_LENGTH} characters`),
    email: z.string()
        .email('Invalid email address'),
    role: z.nativeEnum(UserRole),
    employeeStatus: z.nativeEnum(EmployeeStatus).optional(),
});

/**
 * Schema for updating an existing user
 * Aligns with UpdateUserDto
 */
export const updateUserSchema = z.object({
    name: z.string()
        .min(USER_CONSTRAINTS.NAME_MIN_LENGTH)
        .max(USER_CONSTRAINTS.NAME_MAX_LENGTH)
        .optional(),
    role: z.nativeEnum(UserRole).optional(),
    employeeStatus: z.nativeEnum(EmployeeStatus).optional(),
});

/**
 * Schema for user registration (with password)
 */
export const registerUserSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string()
        .min(USER_CONSTRAINTS.PASSWORD_MIN_LENGTH, `Password must be at least ${USER_CONSTRAINTS.PASSWORD_MIN_LENGTH} characters`),
    phone: z.string().optional(),
    role: z.nativeEnum(UserRole),
});

/**
 * Schema for user login
 */
export const loginUserSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

// Aliases for convenience
export const loginSchema = loginUserSchema;
export const registerSchema = registerUserSchema;

// Export inferred types
export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
export type RegisterUserFormData = z.infer<typeof registerUserSchema>;
export type LoginUserFormData = z.infer<typeof loginUserSchema>;

// Aliases for convenience
export type RegisterFormData = RegisterUserFormData;
export type LoginFormData = LoginUserFormData;
