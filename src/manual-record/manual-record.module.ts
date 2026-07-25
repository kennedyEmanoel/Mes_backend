import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ManualRecordService } from './manual-record.service';
import { ManualRecordController } from './manual-record.controller';
import { ManualRecord } from './entities/manual-record.entity';
import { ProductionOrder } from '../production-order/entities/production-order.entity';
import { Step } from '../steps/entities/step.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ManualRecord, ProductionOrder, Step, User]),
  ],
  controllers: [ManualRecordController],
  providers: [ManualRecordService],
})
export class ManualRecordModule {}
