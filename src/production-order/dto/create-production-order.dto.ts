export class CreateProductionOrderDto {
  op_number: string;
  branch_id: number;
  product_id: number;
  start_date?: Date;
  estimated_end_date?: Date;
  target_quantity: number;
  status?: string;
}
