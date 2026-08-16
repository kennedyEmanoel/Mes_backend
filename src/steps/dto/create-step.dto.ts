import { IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';

export class CreateStepDto {
  @IsInt()
  @IsNotEmpty()
  step_template_id: number;

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
