import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateStepDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @Min(0)
  order_index: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  target_quantity?: number;

  @IsInt()
  @IsNotEmpty()
  productionOrderId: number;
}
