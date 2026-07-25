import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StepsService } from './steps.service';
import { StepsController } from './steps.controller';
import { Step } from './entities/step.entity';
import { ProductionOrder } from '../production-order/entities/production-order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Step, ProductionOrder])],
  controllers: [StepsController],
  providers: [StepsService],
})
export class StepsModule {}
