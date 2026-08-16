import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStepDto } from './dto/create-step.dto';
import { UpdateStepDto } from './dto/update-step.dto';
import type { AuthenticatedUser } from '../auth/decorators/current-user.decorator';
import {
  branchScope,
  productionOrderBranchScope,
} from '../auth/utils/branch-scope.util';

const STEP_INCLUDE = {
  productionOrder: true,
  stepTemplate: true,
  assignments: {
    include: {
      user: {
        select: { id: true, name: true, registrationNumber: true },
      },
    },
  },
} as const;

@Injectable()
export class StepsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createStepDto: CreateStepDto, currentUser: AuthenticatedUser) {
    const {
      step_template_id,
      order_index,
      target_quantity,
      productionOrderId,
    } = createStepDto;

    await this.findProductionOrderOrThrow(productionOrderId, currentUser);
    await this.findStepTemplateOrThrow(step_template_id);

    return this.prisma.step.create({
      data: {
        stepTemplateId: step_template_id,
        orderIndex: order_index,
        targetQuantity: target_quantity,
        productionOrderId,
      },
      include: STEP_INCLUDE,
    });
  }

  findAll(currentUser: AuthenticatedUser) {
    return this.prisma.step.findMany({
      where: productionOrderBranchScope(currentUser),
      include: STEP_INCLUDE,
    });
  }

  async findOne(id: number, currentUser: AuthenticatedUser) {
    const step = await this.prisma.step.findFirst({
      where: { id, ...productionOrderBranchScope(currentUser) },
      include: STEP_INCLUDE,
    });
    if (!step) {
      throw new NotFoundException(`Step #${id} not found`);
    }
    return step;
  }

  async update(
    id: number,
    updateStepDto: UpdateStepDto,
    currentUser: AuthenticatedUser,
  ) {
    await this.findOne(id, currentUser);
    const {
      step_template_id,
      order_index,
      target_quantity,
      productionOrderId,
    } = updateStepDto;

    if (productionOrderId) {
      await this.findProductionOrderOrThrow(productionOrderId, currentUser);
    }
    if (step_template_id) {
      await this.findStepTemplateOrThrow(step_template_id);
    }

    return this.prisma.step.update({
      where: { id },
      data: {
        stepTemplateId: step_template_id,
        orderIndex: order_index,
        targetQuantity: target_quantity,
        productionOrderId,
      },
      include: STEP_INCLUDE,
    });
  }

  async remove(id: number, currentUser: AuthenticatedUser) {
    await this.findOne(id, currentUser);
    return this.prisma.step.delete({ where: { id } });
  }

  async assignUser(
    stepId: number,
    userId: number,
    currentUser: AuthenticatedUser,
  ) {
    const step = await this.findOne(stepId, currentUser);
    await this.findUserInBranchOrThrow(userId, step.productionOrder.branchId);

    await this.prisma.stepAssignment.upsert({
      where: { stepId_userId: { stepId, userId } },
      create: { stepId, userId },
      update: {},
    });

    return this.findOne(stepId, currentUser);
  }

  async unassignUser(
    stepId: number,
    userId: number,
    currentUser: AuthenticatedUser,
  ) {
    await this.findOne(stepId, currentUser);
    await this.prisma.stepAssignment.deleteMany({ where: { stepId, userId } });
    return this.findOne(stepId, currentUser);
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

  private async findStepTemplateOrThrow(stepTemplateId: number) {
    const stepTemplate = await this.prisma.stepTemplate.findUnique({
      where: { id: stepTemplateId },
    });
    if (!stepTemplate) {
      throw new NotFoundException(`StepTemplate #${stepTemplateId} not found`);
    }
    return stepTemplate;
  }

  private async findUserInBranchOrThrow(userId: number, branchId: number) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, branchId },
    });
    if (!user) {
      throw new NotFoundException(`User #${userId} not found`);
    }
    return user;
  }
}
