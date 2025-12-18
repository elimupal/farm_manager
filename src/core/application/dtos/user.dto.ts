// User DTOs
import { UserRole, EmployeeStatus } from '@/core/domain/constants';

export interface CreateUserDto {
    name: string;
    email: string;
    role: UserRole;
    employeeStatus?: EmployeeStatus;
}

export interface UpdateUserDto {
    name?: string;
    role?: UserRole;
    employeeStatus?: EmployeeStatus;
}

export interface UserResponseDto {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    employeeStatus?: EmployeeStatus;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
