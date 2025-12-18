import { User as PrismaUser } from '@prisma/client';
import { User } from '@/core/domain/entities';
import { UserRole, EmployeeStatus } from '@/core/domain/constants';

export class UserMapper {
    static toDomain(prismaUser: PrismaUser): User {
        return User.reconstitute({
            id: prismaUser.id,
            name: `${prismaUser.firstName} ${prismaUser.lastName}`, // Combine firstName + lastName
            email: prismaUser.email,
            role: prismaUser.role as UserRole,
            employeeStatus: prismaUser.status as EmployeeStatus,
            isActive: true, // Not in schema, default to true
            createdAt: prismaUser.createdAt,
            updatedAt: prismaUser.updatedAt,
        });
    }

    static toPrisma(user: User) {
        const names = user.name.split(' ');
        return {
            id: user.id,
            firstName: names[0] || user.name,
            lastName: names.slice(1).join(' ') || '',
            email: user.email,
            role: user.role as any,
            status: user.employeeStatus as any,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        } as any;
    }
}
