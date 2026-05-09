import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        level: string;
        id: number;
        email: string;
        name: string;
        role: import("@prisma/client").$Enums.Role;
        points: number;
        createdAt: Date;
    }[]>;
    findByEmail(email: string): import("@prisma/client").Prisma.Prisma__UserClient<{
        id: number;
        email: string;
        name: string;
        password: string;
        role: import("@prisma/client").$Enums.Role;
        points: number;
        createdAt: Date;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findById(id: number): Promise<{
        level: string;
        id: number;
        email: string;
        name: string;
        role: import("@prisma/client").$Enums.Role;
        points: number;
        createdAt: Date;
    } | null>;
}
