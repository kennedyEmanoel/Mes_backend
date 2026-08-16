import { Module } from '@nestjs/common';
import { StepTemplatesService } from './step-templates.service';
import { StepTemplatesController } from './step-templates.controller';

@Module({
  controllers: [StepTemplatesController],
  providers: [StepTemplatesService],
})
export class StepTemplatesModule {}
