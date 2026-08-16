import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductionOrderDto } from './dto/create-production-order.dto';
import { UpdateProductionOrderDto } from './dto/update-production-order.dto';
import type { AuthenticatedUser } from '../auth/decorators/current-user.decorator';
import { branchScope } from '../auth/utils/branch-scope.util';

@Injectable()
export class ProductionOrderService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createProductionOrderDto: CreateProductionOrderDto,
    currentUser: AuthenticatedUser,
  ) {
    const {
      op_number,
      branch_id,
      product_id,
      start_date,
      estimated_end_date,
      target_quantity,
      status,
    } = createProductionOrderDto;

    if (currentUser.role !== 'admin' && branch_id !== currentUser.branchId) {
      throw new ForbiddenException(
        'You can only create production orders in your own branch',
      );
    }

    await this.findBranchOrThrow(branch_id);
    await this.findProductOrThrow(product_id);

    return this.prisma.productionOrder.create({
      data: {
        opNumber: op_number,
        branchId: branch_id,
        productId: product_id,
        startDate: start_date,
        estimatedEndDate: estimated_end_date,
        targetQuantity: target_quantity,
        status,
      },
      include: { branch: true, product: true },
    });
  }

  findAll(currentUser: AuthenticatedUser) {
    return this.prisma.productionOrder.findMany({
      where: branchScope(currentUser),
      include: { branch: true, product: true },
    });
  }

  async findOne(id: number, currentUser: AuthenticatedUser) {
    const productionOrder = await this.prisma.productionOrder.findFirst({
      where: { id, ...branchScope(currentUser) },
      include: { branch: true, product: true },
    });
    if (!productionOrder) {
      throw new NotFoundException(`ProductionOrder #${id} not found`);
    }
    return productionOrder;
  }

  async update(
    id: number,
    updateProductionOrderDto: UpdateProductionOrderDto,
    currentUser: AuthenticatedUser,
  ) {
    await this.findOne(id, currentUser);
    const {
      op_number,
      branch_id,
      product_id,
      start_date,
      estimated_end_date,
      target_quantity,
      status,
    } = updateProductionOrderDto;

    if (
      currentUser.role !== 'admin' &&
      branch_id !== undefined &&
      branch_id !== currentUser.branchId
    ) {
      throw new ForbiddenException(
        'You can only manage production orders in your own branch',
      );
    }

    if (branch_id) {
      await this.findBranchOrThrow(branch_id);
    }
    if (product_id) {
      await this.findProductOrThrow(product_id);
    }

    return this.prisma.productionOrder.update({
      where: { id },
      data: {
        opNumber: op_number,
        branchId: branch_id,
        productId: product_id,
        startDate: start_date,
        estimatedEndDate: estimated_end_date,
        targetQuantity: target_quantity,
        status,
      },
      include: { branch: true, product: true },
    });
  }

  async remove(id: number, currentUser: AuthenticatedUser) {
    await this.findOne(id, currentUser);
    return this.prisma.productionOrder.delete({ where: { id } });
  }

  private async findBranchOrThrow(branchId: number) {
    const branch = await this.prisma.branch.findUnique({
      where: { id: branchId },
    });
    if (!branch) {
      throw new NotFoundException(`Branch #${branchId} not found`);
    }
    return branch;
  }

  private async findProductOrThrow(productId: number) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException(`Product #${productId} not found`);
    }
    return product;
  }
}
