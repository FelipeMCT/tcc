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

export class UpdateMissionDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(1)
  @IsOptional()
  points?: number;

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
