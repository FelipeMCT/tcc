export declare class UpdateMissionDto {
    title?: string;
    description?: string;
    points?: number;
    active?: boolean;
    type?: 'STANDARD' | 'WEEKLY_DAILY';
    startDate?: string;
    endDate?: string;
    bonusPercentage?: number;
    requiredCompletions?: number;
}
