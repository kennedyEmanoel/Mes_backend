import { Module } from '@nestjs/common';
import { ProductionOrderService } from './production-order.service';
import { ProductionOrderController } from './production-order.controller';

@Module({
  controllers: [ProductionOrderController],
  providers: [ProductionOrderService],
})
export class ProductionOrderModule {}
