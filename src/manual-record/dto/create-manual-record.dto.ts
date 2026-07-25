import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateManualRecordDto {
  @IsString()
  @IsNotEmpty()
  hour_range: string;

  @IsInt()
  @Min(0)
  produced_quantity: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  defect_quantity?: number;

  @IsInt()
  @IsNotEmpty()
  productionOrderId: number;

  @IsInt()
  @IsNotEmpty()
  stepId: number;

  @IsInt()
  @IsOptional()
  userId?: number;
}
