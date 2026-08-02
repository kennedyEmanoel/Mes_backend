import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStepDto } from './dto/create-step.dto';
import { UpdateStepDto } from './dto/update-step.dto';

@Injectable()
export class StepsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createStepDto: CreateStepDto) {
    const { name, order_index, target_quantity, productionOrderId } =
      createStepDto;

    await this.findProductionOrderOrThrow(productionOrderId);

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

  findAll() {
    return this.prisma.step.findMany({ include: { productionOrder: true } });
  }

  async findOne(id: number) {
    const step = await this.prisma.step.findUnique({
      where: { id },
      include: { productionOrder: true },
    });
    if (!step) {
      throw new NotFoundException(`Step #${id} not found`);
    }
    return step;
  }

  async update(id: number, updateStepDto: UpdateStepDto) {
    await this.findOne(id);
    const { name, order_index, target_quantity, productionOrderId } =
      updateStepDto;

    if (productionOrderId) {
      await this.findProductionOrderOrThrow(productionOrderId);
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

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.step.delete({ where: { id } });
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
}
