import {
  IsBoolean,
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateMissionDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(1)
  points: number;

  @IsBoolean()
  @IsOptional()
  active?: boolean;

  @IsOptional()
  @IsIn(['STANDARD', 'WEEKLY_DAILY'])
  type?: 'STANDARD' | 'WEEKLY_DAILY';

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsNumber()
  bonusPercentage?: number;

  @IsOptional()
  @IsNumber()
  requiredCompletions?: number;
}
