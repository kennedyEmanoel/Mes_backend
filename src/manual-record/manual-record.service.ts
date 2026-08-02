import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateManualRecordDto } from './dto/create-manual-record.dto';
import { UpdateManualRecordDto } from './dto/update-manual-record.dto';

@Injectable()
export class ManualRecordService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createManualRecordDto: CreateManualRecordDto) {
    const {
      hour_range,
      produced_quantity,
      defect_quantity,
      productionOrderId,
      stepId,
      userId,
    } = createManualRecordDto;

    await this.findProductionOrderOrThrow(productionOrderId);
    await this.findStepOrThrow(stepId);
    if (userId) {
      await this.findUserOrThrow(userId);
    }

    return this.prisma.manualRecord.create({
      data: {
        hourRange: hour_range,
        producedQuantity: produced_quantity,
        defectQuantity: defect_quantity,
        productionOrderId,
        stepId,
        userId,
      },
      include: { productionOrder: true, step: true, user: true },
    });
  }

  findAll() {
    return this.prisma.manualRecord.findMany({
      include: { productionOrder: true, step: true, user: true },
    });
  }

  async findOne(id: number) {
    const manualRecord = await this.prisma.manualRecord.findUnique({
      where: { id },
      include: { productionOrder: true, step: true, user: true },
    });
    if (!manualRecord) {
      throw new NotFoundException(`ManualRecord #${id} not found`);
    }
    return manualRecord;
  }

  async update(id: number, updateManualRecordDto: UpdateManualRecordDto) {
    await this.findOne(id);
    const {
      hour_range,
      produced_quantity,
      defect_quantity,
      productionOrderId,
      stepId,
      userId,
    } = updateManualRecordDto;

    if (productionOrderId) {
      await this.findProductionOrderOrThrow(productionOrderId);
    }
    if (stepId) {
      await this.findStepOrThrow(stepId);
    }
    if (userId) {
      await this.findUserOrThrow(userId);
    }

    return this.prisma.manualRecord.update({
      where: { id },
      data: {
        hourRange: hour_range,
        producedQuantity: produced_quantity,
        defectQuantity: defect_quantity,
        productionOrderId,
        stepId,
        userId,
      },
      include: { productionOrder: true, step: true, user: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.manualRecord.delete({ where: { id } });
  }

  private async findProductionOrderOrThrow(productionOrderId: number) {
    const productionOrder = await this.prisma.productionOrder.findUnique({
      where: { id: productionOrderId },
    });
    if (!productionOrder) {
      throw new NotFoundException(
        `ProductionOrder #${productionOrderId} not found`,
      );
    }
    return productionOrder;
  }

  private async findStepOrThrow(stepId: number) {
    const step = await this.prisma.step.findUnique({ where: { id: stepId } });
    if (!step) {
      throw new NotFoundException(`Step #${stepId} not found`);
    }
    return step;
  }

  private async findUserOrThrow(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User #${userId} not found`);
    }
    return user;
  }
}
