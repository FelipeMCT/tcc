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
    }[]>;
    findActive(): import("@prisma/client").Prisma.PrismaPromise<{
        id: number;
        points: number;
        createdAt: Date;
        title: string;
        description: string;
        active: boolean;
    }[]>;
    create(createMissionDto: CreateMissionDto): import("@prisma/client").Prisma.Prisma__MissionClient<{
        id: number;
        points: number;
        createdAt: Date;
        title: string;
        description: string;
        active: boolean;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: number, updateMissionDto: UpdateMissionDto): Promise<{
        id: number;
        points: number;
        createdAt: Date;
        title: string;
        description: string;
        active: boolean;
    }>;
    toggleActive(id: number): Promise<{
        id: number;
        points: number;
        createdAt: Date;
        title: string;
        description: string;
        active: boolean;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
