import { PointsService } from './points.service';
export declare class PointsController {
    private pointsService;
    constructor(pointsService: PointsService);
    getMyHistory(user: {
        id: number;
    }): import("@prisma/client").Prisma.PrismaPromise<{
        id: number;
        points: number;
        createdAt: Date;
        mission: {
            title: string;
            description: string;
        };
        missionId: number;
    }[]>;
    completeMission(user: {
        id: number;
    }, missionId: number): Promise<{
        message: string;
        mission: {
            id: number;
            title: string;
        };
        pointsEarned: number;
        bonusEarned: number;
        totalUserPoints: number;
        completions: number;
        requiredCompletions: null;
    } | {
        message: string;
        mission: {
            id: number;
            title: string;
        };
        pointsEarned: number;
        bonusEarned: number;
        totalUserPoints: number;
        completions: number;
        requiredCompletions: number;
    }>;
}
