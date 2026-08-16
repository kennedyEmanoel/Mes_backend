import { PartialType } from '@nestjs/mapped-types';
import { CreateStepTemplateDto } from './create-step-template.dto';

export class UpdateStepTemplateDto extends PartialType(CreateStepTemplateDto) {}
