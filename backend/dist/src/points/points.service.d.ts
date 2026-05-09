import { PrismaService } from '../prisma/prisma.service';
export declare class PointsService {
    private prisma;
    constructor(prisma: PrismaService);
    completeMission(userId: number, missionId: number): Promise<{
        message: string;
        mission: {
            id: number;
            title: string;
        };
        pointsEarned: number;
        totalPoints: number;
    }>;
    getMyHistory(userId: number): import("@prisma/client").Prisma.PrismaPromise<{
        id: number;
        points: number;
        createdAt: Date;
        mission: {
            title: string;
            description: string;
        };
        missionId: number;
    }[]>;
}
