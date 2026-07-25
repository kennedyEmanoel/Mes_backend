import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStepDto } from './dto/create-step.dto';
import { UpdateStepDto } from './dto/update-step.dto';
import { Step } from './entities/step.entity';
import { ProductionOrder } from '../production-order/entities/production-order.entity';

@Injectable()
export class StepsService {
  constructor(
    @InjectRepository(Step)
    private readonly stepRepository: Repository<Step>,
    @InjectRepository(ProductionOrder)
    private readonly productionOrderRepository: Repository<ProductionOrder>,
  ) {}

  async create(createStepDto: CreateStepDto) {
    const { productionOrderId, ...rest } = createStepDto;

    const step = this.stepRepository.create(rest);
    step.productionOrder =
      await this.findProductionOrderOrThrow(productionOrderId);

    return this.stepRepository.save(step);
  }

  findAll() {
    return this.stepRepository.find({ relations: ['productionOrder'] });
  }

  async findOne(id: number) {
    const step = await this.stepRepository.findOne({
      where: { id },
      relations: ['productionOrder'],
    });
    if (!step) {
      throw new NotFoundException(`Step #${id} not found`);
    }
    return step;
  }

  async update(id: number, updateStepDto: UpdateStepDto) {
    const step = await this.findOne(id);
    const { productionOrderId, ...rest } = updateStepDto;
    Object.assign(step, rest);

    if (productionOrderId) {
      step.productionOrder =
        await this.findProductionOrderOrThrow(productionOrderId);
    }

    return this.stepRepository.save(step);
  }

  async remove(id: number) {
    const step = await this.findOne(id);
    return this.stepRepository.remove(step);
  }

  private async findProductionOrderOrThrow(productionOrderId: number) {
    const productionOrder = await this.productionOrderRepository.findOneBy({
      id: productionOrderId,
    });
    if (!productionOrder) {
      throw new NotFoundException(
        `ProductionOrder #${productionOrderId} not found`,
      );
    }
    return productionOrder;
  }
}
