import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<{
        level: string;
        id: number;
        email: string;
        name: string;
        role: import("@prisma/client").$Enums.Role;
        points: number;
        currentStreak: number;
        longestStreak: number;
        lastActivityDate: Date | null;
        createdAt: Date;
    }[]>;
    recordActivity(user: {
        id: number;
    }): Promise<{
        currentStreak: number;
        longestStreak: number;
        lastActivityDate: Date | null;
    }>;
    findById(id: number): Promise<{
        level: string;
        id: number;
        email: string;
        name: string;
        role: import("@prisma/client").$Enums.Role;
        points: number;
        currentStreak: number;
        longestStreak: number;
        lastActivityDate: Date | null;
        createdAt: Date;
    } | null>;
}
