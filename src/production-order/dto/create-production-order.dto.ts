import {
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateProductionOrderDto {
  @IsString()
  @IsNotEmpty()
  op_number: string;

  @IsInt()
  @IsNotEmpty()
  branch_id: number;

  @IsInt()
  @IsNotEmpty()
  product_id: number;

  @IsDateString()
  @IsOptional()
  start_date?: Date;

  @IsDateString()
  @IsOptional()
  estimated_end_date?: Date;

  @IsInt()
  @Min(1)
  target_quantity: number;

  @IsIn(['Aberta', 'Em andamento', 'Concluída', 'Cancelada'])
  @IsOptional()
  status?: string;
}
