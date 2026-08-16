import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStepTemplateDto } from './dto/create-step-template.dto';
import { UpdateStepTemplateDto } from './dto/update-step-template.dto';

@Injectable()
export class StepTemplatesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createStepTemplateDto: CreateStepTemplateDto) {
    return this.prisma.stepTemplate.create({ data: createStepTemplateDto });
  }

  findAll() {
    return this.prisma.stepTemplate.findMany();
  }

  async findOne(id: number) {
    const stepTemplate = await this.prisma.stepTemplate.findUnique({
      where: { id },
    });
    if (!stepTemplate) {
      throw new NotFoundException(`StepTemplate #${id} not found`);
    }
    return stepTemplate;
  }

  async update(id: number, updateStepTemplateDto: UpdateStepTemplateDto) {
    await this.findOne(id);
    return this.prisma.stepTemplate.update({
      where: { id },
      data: updateStepTemplateDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.stepTemplate.delete({ where: { id } });
  }
}
