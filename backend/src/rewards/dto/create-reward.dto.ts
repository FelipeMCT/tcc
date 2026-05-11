import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateRewardDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(1)
  cost: number;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsBoolean()
  @IsOptional()
  active?: boolean;
}
