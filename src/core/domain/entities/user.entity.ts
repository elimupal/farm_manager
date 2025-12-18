/**
 * User Entity
 * Simplified version focusing on core user management
 */

import { Entity } from '@/core/shared';
import { UserRole, EmployeeStatus } from '@/core/domain/constants';
import { ValidationError } from '@/core/domain/errors';

interface UserProps {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    employeeStatus?: EmployeeStatus;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

interface CreateUserProps {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    employeeStatus?: EmployeeStatus;
}

export class User implements Entity {
    private constructor(private readonly props: UserProps) {
        this.validate();
    }

    static create(input: CreateUserProps): User {
        const props: UserProps = {
            id: input.id,
            name: input.name,
            email: input.email,
            role: input.role,
            employeeStatus: input.employeeStatus,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        return new User(props);
    }

    static reconstitute(props: UserProps): User {
        return new User(props);
    }

    private validate(): void {
        if (!this.props.email || !this.props.email.includes('@')) {
            throw new ValidationError('Valid email is required');
        }

        if (!this.props.name || this.props.name.trim().length < 2) {
            throw new ValidationError('Name must be at least 2 characters');
        }
    }

    // Getters
    get id(): string {
        return this.props.id;
    }

    get name(): string {
        return this.props.name;
    }

    get email(): string {
        return this.props.email;
    }

    get role(): UserRole {
        return this.props.role;
    }

    get employeeStatus(): EmployeeStatus | undefined {
        return this.props.employeeStatus;
    }

    get isActive(): boolean {
        return this.props.isActive;
    }

    get createdAt(): Date {
        return this.props.createdAt;
    }

    get updatedAt(): Date {
        return this.props.updatedAt;
    }

    // Business methods
    deactivate(): User {
        return User.reconstitute({
            ...this.props,
            isActive: false,
            updatedAt: new Date(),
        });
    }

    activate(): User {
        return User.reconstitute({
            ...this.props,
            isActive: true,
            updatedAt: new Date(),
        });
    }

    changeRole(newRole: UserRole): User {
        return User.reconstitute({
            ...this.props,
            role: newRole,
            updatedAt: new Date(),
        });
    }

    isAdmin(): boolean {
        return this.props.role === UserRole.OWNER || this.props.role === UserRole.MANAGER;
    }

    canManageUsers(): boolean {
        return this.props.role === UserRole.OWNER;
    }
}
