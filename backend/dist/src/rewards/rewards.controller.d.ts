import { RewardsService } from './rewards.service';
import { CreateRewardDto } from './dto/create-reward.dto';
import { UpdateRewardDto } from './dto/update-reward.dto';
export declare class RewardsController {
    private rewardsService;
    constructor(rewardsService: RewardsService);
    findAll(): Promise<{
        redeemed: number;
        remaining: number;
        id: number;
        createdAt: Date;
        title: string;
        description: string;
        active: boolean;
        cost: number;
        quantity: number;
        allowMultipleRedemptions: boolean;
    }[]>;
    findActive(): Promise<{
        redeemed: number;
        remaining: number;
        id: number;
        createdAt: Date;
        title: string;
        description: string;
        active: boolean;
        cost: number;
        quantity: number;
        allowMultipleRedemptions: boolean;
    }[]>;
    getMyRedemptions(user: {
        id: number;
    }): import("@prisma/client").Prisma.PrismaPromise<({
        reward: {
            id: number;
            title: string;
            description: string;
        };
    } & {
        id: number;
        createdAt: Date;
        userId: number;
        cost: number;
        rewardId: number;
    })[]>;
    create(dto: CreateRewardDto): import("@prisma/client").Prisma.Prisma__RewardClient<{
        id: number;
        createdAt: Date;
        title: string;
        description: string;
        active: boolean;
        cost: number;
        quantity: number;
        allowMultipleRedemptions: boolean;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: number, dto: UpdateRewardDto): Promise<{
        id: number;
        createdAt: Date;
        title: string;
        description: string;
        active: boolean;
        cost: number;
        quantity: number;
        allowMultipleRedemptions: boolean;
    }>;
    toggleActive(id: number): Promise<{
        id: number;
        createdAt: Date;
        title: string;
        description: string;
        active: boolean;
        cost: number;
        quantity: number;
        allowMultipleRedemptions: boolean;
    }>;
    redeem(user: {
        id: number;
    }, rewardId: number): Promise<{
        message: string;
        reward: {
            id: number;
            title: string;
        };
        cost: number;
        remainingPoints: number;
    }>;
}
