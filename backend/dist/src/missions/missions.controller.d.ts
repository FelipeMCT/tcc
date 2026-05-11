import { MissionsService } from './missions.service';
import { CreateMissionDto } from './dto/create-mission.dto';
import { UpdateMissionDto } from './dto/update-mission.dto';
export declare class MissionsController {
    private missionsService;
    constructor(missionsService: MissionsService);
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
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
    findActive(): import("@prisma/client").Prisma.PrismaPromise<{
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
    getMyProgress(user: {
        id: number;
    }): Promise<{
        missionId: number;
        type: import("@prisma/client").$Enums.MissionType;
        completions: number;
        completedToday: boolean;
        bonusReceived: boolean;
        requiredCompletions: number | null;
        canCompleteToday: boolean;
    }[]>;
    create(createMissionDto: CreateMissionDto): import("@prisma/client").Prisma.Prisma__MissionClient<{
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
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: number, updateMissionDto: UpdateMissionDto): Promise<{
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
}
