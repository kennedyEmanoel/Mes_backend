import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateManualRecordDto } from './dto/create-manual-record.dto';
import { UpdateManualRecordDto } from './dto/update-manual-record.dto';
import type { AuthenticatedUser } from '../auth/decorators/current-user.decorator';
import {
  branchScope,
  productionOrderBranchScope,
} from '../auth/utils/branch-scope.util';

@Injectable()
export class ManualRecordService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createManualRecordDto: CreateManualRecordDto,
    currentUser: AuthenticatedUser,
  ) {
    const {
      hour_range,
      produced_quantity,
      defect_quantity,
      productionOrderId,
      stepId,
      userId,
    } = createManualRecordDto;

    await this.findProductionOrderOrThrow(productionOrderId, currentUser);
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

  findAll(currentUser: AuthenticatedUser) {
    return this.prisma.manualRecord.findMany({
      where: productionOrderBranchScope(currentUser),
      include: { productionOrder: true, step: true, user: true },
    });
  }

  async findOne(id: number, currentUser: AuthenticatedUser) {
    const manualRecord = await this.prisma.manualRecord.findFirst({
      where: { id, ...productionOrderBranchScope(currentUser) },
      include: { productionOrder: true, step: true, user: true },
    });
    if (!manualRecord) {
      throw new NotFoundException(`ManualRecord #${id} not found`);
    }
    return manualRecord;
  }

  async update(
    id: number,
    updateManualRecordDto: UpdateManualRecordDto,
    currentUser: AuthenticatedUser,
  ) {
    await this.findOne(id, currentUser);
    const {
      hour_range,
      produced_quantity,
      defect_quantity,
      productionOrderId,
      stepId,
      userId,
    } = updateManualRecordDto;

    if (productionOrderId) {
      await this.findProductionOrderOrThrow(productionOrderId, currentUser);
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

  async remove(id: number, currentUser: AuthenticatedUser) {
    await this.findOne(id, currentUser);
    return this.prisma.manualRecord.delete({ where: { id } });
  }

  private async findProductionOrderOrThrow(
    productionOrderId: number,
    currentUser: AuthenticatedUser,
  ) {
    const productionOrder = await this.prisma.productionOrder.findFirst({
      where: { id: productionOrderId, ...branchScope(currentUser) },
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
