import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductionOrderDto } from './dto/create-production-order.dto';
import { UpdateProductionOrderDto } from './dto/update-production-order.dto';
import { ProductionOrder } from './entities/production-order.entity';
import { Branch } from '../branches/entities/branch.entity';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class ProductionOrderService {
  constructor(
    @InjectRepository(ProductionOrder)
    private readonly productionOrderRepository: Repository<ProductionOrder>,
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductionOrderDto: CreateProductionOrderDto) {
    const { branch_id, product_id, ...rest } = createProductionOrderDto;

    const productionOrder = this.productionOrderRepository.create(rest);
    productionOrder.branch = await this.findBranchOrThrow(branch_id);
    productionOrder.product = await this.findProductOrThrow(product_id);

    return this.productionOrderRepository.save(productionOrder);
  }

  findAll() {
    return this.productionOrderRepository.find({
      relations: ['branch', 'product'],
    });
  }

  async findOne(id: number) {
    const productionOrder = await this.productionOrderRepository.findOne({
      where: { id },
      relations: ['branch', 'product'],
    });
    if (!productionOrder) {
      throw new NotFoundException(`ProductionOrder #${id} not found`);
    }
    return productionOrder;
  }

  async update(id: number, updateProductionOrderDto: UpdateProductionOrderDto) {
    const productionOrder = await this.findOne(id);
    const { branch_id, product_id, ...rest } = updateProductionOrderDto;
    Object.assign(productionOrder, rest);

    if (branch_id) {
      productionOrder.branch = await this.findBranchOrThrow(branch_id);
    }
    if (product_id) {
      productionOrder.product = await this.findProductOrThrow(product_id);
    }

    return this.productionOrderRepository.save(productionOrder);
  }

  async remove(id: number) {
    const productionOrder = await this.findOne(id);
    return this.productionOrderRepository.remove(productionOrder);
  }

  private async findBranchOrThrow(branchId: number) {
    const branch = await this.branchRepository.findOneBy({ id: branchId });
    if (!branch) {
      throw new NotFoundException(`Branch #${branchId} not found`);
    }
    return branch;
  }

  private async findProductOrThrow(productId: number) {
    const product = await this.productRepository.findOneBy({ id: productId });
    if (!product) {
      throw new NotFoundException(`Product #${productId} not found`);
    }
    return product;
  }
}
