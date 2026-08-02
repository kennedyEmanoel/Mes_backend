import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStepDto } from './dto/create-step.dto';
import { UpdateStepDto } from './dto/update-step.dto';
import type { AuthenticatedUser } from '../auth/decorators/current-user.decorator';
import {
  branchScope,
  productionOrderBranchScope,
} from '../auth/utils/branch-scope.util';

@Injectable()
export class StepsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createStepDto: CreateStepDto, currentUser: AuthenticatedUser) {
    const { name, order_index, target_quantity, productionOrderId } =
      createStepDto;

    await this.findProductionOrderOrThrow(productionOrderId, currentUser);

    return this.prisma.step.create({
      data: {
        name,
        orderIndex: order_index,
        targetQuantity: target_quantity,
        productionOrderId,
      },
      include: { productionOrder: true },
    });
  }

  findAll(currentUser: AuthenticatedUser) {
    return this.prisma.step.findMany({
      where: productionOrderBranchScope(currentUser),
      include: { productionOrder: true },
    });
  }

  async findOne(id: number, currentUser: AuthenticatedUser) {
    const step = await this.prisma.step.findFirst({
      where: { id, ...productionOrderBranchScope(currentUser) },
      include: { productionOrder: true },
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
    const { name, order_index, target_quantity, productionOrderId } =
      updateStepDto;

    if (productionOrderId) {
      await this.findProductionOrderOrThrow(productionOrderId, currentUser);
    }

    return this.prisma.step.update({
      where: { id },
      data: {
        name,
        orderIndex: order_index,
        targetQuantity: target_quantity,
        productionOrderId,
      },
      include: { productionOrder: true },
    });
  }

  async remove(id: number, currentUser: AuthenticatedUser) {
    await this.findOne(id, currentUser);
    return this.prisma.step.delete({ where: { id } });
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
}
