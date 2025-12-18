import { PrismaClient } from '@prisma/client';
import { User } from '@/core/domain/entities';
import { IUserRepository } from '@/core/application/ports/repositories';
import { UserMapper } from '../mappers/user.mapper';

export class PrismaUserRepository implements IUserRepository {
    constructor(private readonly prisma: PrismaClient) { }

    async findById(id: string): Promise<User | null> {
        const prismaUser = await this.prisma.user.findUnique({ where: { id } });
        return prismaUser ? UserMapper.toDomain(prismaUser) : null;
    }

    async findByEmail(email: string): Promise<User | null> {
        const prismaUser = await this.prisma.user.findUnique({ where: { email } });
        return prismaUser ? UserMapper.toDomain(prismaUser) : null;
    }

    async findAll(): Promise<User[]> {
        const users = await this.prisma.user.findMany({ orderBy: { firstName: 'asc' } });
        return users.map(UserMapper.toDomain);
    }

    async findByRole(role: string): Promise<User[]> {
        const users = await this.prisma.user.findMany({
            where: { role: role as any },
            orderBy: { firstName: 'asc' },
        });
        return users.map(UserMapper.toDomain);
    }

    async save(user: User): Promise<void> {
        await this.prisma.user.create({ data: UserMapper.toPrisma(user) });
    }

    async update(user: User): Promise<void> {
        await this.prisma.user.update({
            where: { id: user.id },
            data: UserMapper.toPrisma(user),
        });
    }

    async delete(id: string): Promise<void> {
        await this.prisma.user.delete({ where: { id } });
    }

    async exists(id: string): Promise<boolean> {
        const count = await this.prisma.user.count({ where: { id } });
        return count > 0;
    }
}
