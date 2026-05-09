import { FeedbacksService } from './feedbacks.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
export declare class FeedbacksController {
    private feedbacksService;
    constructor(feedbacksService: FeedbacksService);
    create(user: {
        id: number;
    }, dto: CreateFeedbackDto): Promise<{
        id: number;
        createdAt: Date;
        title: string;
        userId: number;
        message: string;
    }>;
    getMyFeedbacks(user: {
        id: number;
    }): import("@prisma/client").Prisma.PrismaPromise<{
        id: number;
        createdAt: Date;
        title: string;
        userId: number;
        message: string;
    }[]>;
    findAll(): Promise<{
        user: {
            level: string;
            id: number;
            email: string;
            name: string;
            role: import("@prisma/client").$Enums.Role;
            points: number;
        };
        id: number;
        createdAt: Date;
        title: string;
        userId: number;
        message: string;
    }[]>;
}
