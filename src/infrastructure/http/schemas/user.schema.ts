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
export const registerUserSchema = createUserSchema.extend({
    password: z.string()
        .min(USER_CONSTRAINTS.PASSWORD_MIN_LENGTH, `Password must be at least ${USER_CONSTRAINTS.PASSWORD_MIN_LENGTH} characters`),
});

/**
 * Schema for user login
 */
export const loginUserSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

// Export inferred types
export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
export type RegisterUserFormData = z.infer<typeof registerUserSchema>;
export type LoginUserFormData = z.infer<typeof loginUserSchema>;
