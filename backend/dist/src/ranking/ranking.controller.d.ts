import { RankingService } from './ranking.service';
export declare class RankingController {
    private rankingService;
    constructor(rankingService: RankingService);
    getRanking(): Promise<{
        level: string;
        id: number;
        name: string;
        role: import("@prisma/client").$Enums.Role;
        points: number;
        currentStreak: number;
        longestStreak: number;
    }[]>;
}
