import { PrismaService } from '../prisma/prisma.service';
export declare class ReportsService {
    private prisma;
    constructor(prisma: PrismaService);
    getManagerSummary(): Promise<{
        totalEmployees: number;
        totalMissions: number;
        activeMissions: number;
        inactiveMissions: number;
        totalMissionCompletions: number;
        totalPointsDistributed: number;
        topEmployeeByPoints: {
            level: string;
            id: number;
            email: string;
            name: string;
            points: number;
        } | null;
        topEmployeeByCompletions: {
            completedMissions: number;
            id: number;
            email: string;
            name: string;
            points: number;
        } | null;
        mostCompletedMission: {
            id: number;
            title: string;
            description: string;
            completions: number;
            points: number;
        } | null;
        employeeParticipation: {
            id: number;
            name: string;
            email: string;
            points: number;
            level: string;
            completedMissions: number;
            participationRate: number;
        }[];
        employeesWithoutCompletions: {
            id: number;
            name: string;
            email: string;
            points: number;
        }[];
    }>;
}
