import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StepTemplatesService } from './step-templates.service';
import { CreateStepTemplateDto } from './dto/create-step-template.dto';
import { UpdateStepTemplateDto } from './dto/update-step-template.dto';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('step-templates')
export class StepTemplatesController {
  constructor(private readonly stepTemplatesService: StepTemplatesService) {}

  @Roles('manager', 'analyst', 'admin')
  @Post()
  create(@Body() createStepTemplateDto: CreateStepTemplateDto) {
    return this.stepTemplatesService.create(createStepTemplateDto);
  }

  @Get()
  findAll() {
    return this.stepTemplatesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stepTemplatesService.findOne(+id);
  }

  @Roles('manager', 'analyst', 'admin')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateStepTemplateDto: UpdateStepTemplateDto,
  ) {
    return this.stepTemplatesService.update(+id, updateStepTemplateDto);
  }

  @Roles('manager', 'analyst', 'admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stepTemplatesService.remove(+id);
  }
}
