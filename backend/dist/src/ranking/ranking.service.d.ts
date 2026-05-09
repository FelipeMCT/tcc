import { PrismaService } from '../prisma/prisma.service';
export declare class RankingService {
    private prisma;
    constructor(prisma: PrismaService);
    getRanking(): Promise<{
        level: string;
        id: number;
        name: string;
        role: import("@prisma/client").$Enums.Role;
        points: number;
    }[]>;
}
