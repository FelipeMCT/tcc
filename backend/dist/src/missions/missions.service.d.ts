import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMissionDto } from './dto/create-mission.dto';
import { UpdateMissionDto } from './dto/update-mission.dto';
export declare class MissionsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Prisma.PrismaPromise<{
        id: number;
        points: number;
        createdAt: Date;
        title: string;
        description: string;
        active: boolean;
        type: import("@prisma/client").$Enums.MissionType;
        startDate: Date | null;
        endDate: Date | null;
        bonusPercentage: number | null;
        requiredCompletions: number | null;
    }[]>;
    findActive(): Prisma.PrismaPromise<{
        id: number;
        points: number;
        createdAt: Date;
        title: string;
        description: string;
        active: boolean;
        type: import("@prisma/client").$Enums.MissionType;
        startDate: Date | null;
        endDate: Date | null;
        bonusPercentage: number | null;
        requiredCompletions: number | null;
    }[]>;
    create(dto: CreateMissionDto): Prisma.Prisma__MissionClient<{
        id: number;
        points: number;
        createdAt: Date;
        title: string;
        description: string;
        active: boolean;
        type: import("@prisma/client").$Enums.MissionType;
        startDate: Date | null;
        endDate: Date | null;
        bonusPercentage: number | null;
        requiredCompletions: number | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, Prisma.PrismaClientOptions>;
    update(id: number, dto: UpdateMissionDto): Promise<{
        id: number;
        points: number;
        createdAt: Date;
        title: string;
        description: string;
        active: boolean;
        type: import("@prisma/client").$Enums.MissionType;
        startDate: Date | null;
        endDate: Date | null;
        bonusPercentage: number | null;
        requiredCompletions: number | null;
    }>;
    toggleActive(id: number): Promise<{
        id: number;
        points: number;
        createdAt: Date;
        title: string;
        description: string;
        active: boolean;
        type: import("@prisma/client").$Enums.MissionType;
        startDate: Date | null;
        endDate: Date | null;
        bonusPercentage: number | null;
        requiredCompletions: number | null;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
    getMyProgress(userId: number): Promise<{
        missionId: number;
        type: import("@prisma/client").$Enums.MissionType;
        completions: number;
        completedToday: boolean;
        bonusReceived: boolean;
        requiredCompletions: number | null;
        canCompleteToday: boolean;
    }[]>;
}
