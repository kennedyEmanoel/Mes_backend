import { Module } from '@nestjs/common';
import { ManualRecordService } from './manual-record.service';
import { ManualRecordController } from './manual-record.controller';

@Module({
  controllers: [ManualRecordController],
  providers: [ManualRecordService],
})
export class ManualRecordModule {}
