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
        createdAt: Date;
    }[]>;
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
