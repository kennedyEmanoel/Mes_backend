import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductionOrderService } from './production-order.service';
import { ProductionOrderController } from './production-order.controller';
import { ProductionOrder } from './entities/production-order.entity';
import { Branch } from '../branches/entities/branch.entity';
import { Product } from '../products/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductionOrder, Branch, Product])],
  controllers: [ProductionOrderController],
  providers: [ProductionOrderService],
})
export class ProductionOrderModule {}
