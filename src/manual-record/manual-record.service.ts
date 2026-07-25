import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateManualRecordDto } from './dto/create-manual-record.dto';
import { UpdateManualRecordDto } from './dto/update-manual-record.dto';
import { ManualRecord } from './entities/manual-record.entity';
import { ProductionOrder } from '../production-order/entities/production-order.entity';
import { Step } from '../steps/entities/step.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ManualRecordService {
  constructor(
    @InjectRepository(ManualRecord)
    private readonly manualRecordRepository: Repository<ManualRecord>,
    @InjectRepository(ProductionOrder)
    private readonly productionOrderRepository: Repository<ProductionOrder>,
    @InjectRepository(Step)
    private readonly stepRepository: Repository<Step>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createManualRecordDto: CreateManualRecordDto) {
    const { productionOrderId, stepId, userId, ...rest } =
      createManualRecordDto;

    const manualRecord = this.manualRecordRepository.create(rest);
    manualRecord.productionOrder =
      await this.findProductionOrderOrThrow(productionOrderId);
    manualRecord.step = await this.findStepOrThrow(stepId);

    if (userId) {
      manualRecord.user = await this.findUserOrThrow(userId);
    }

    return this.manualRecordRepository.save(manualRecord);
  }

  findAll() {
    return this.manualRecordRepository.find({
      relations: ['productionOrder', 'step', 'user'],
    });
  }

  async findOne(id: number) {
    const manualRecord = await this.manualRecordRepository.findOne({
      where: { id },
      relations: ['productionOrder', 'step', 'user'],
    });
    if (!manualRecord) {
      throw new NotFoundException(`ManualRecord #${id} not found`);
    }
    return manualRecord;
  }

  async update(id: number, updateManualRecordDto: UpdateManualRecordDto) {
    const manualRecord = await this.findOne(id);
    const { productionOrderId, stepId, userId, ...rest } =
      updateManualRecordDto;
    Object.assign(manualRecord, rest);

    if (productionOrderId) {
      manualRecord.productionOrder =
        await this.findProductionOrderOrThrow(productionOrderId);
    }
    if (stepId) {
      manualRecord.step = await this.findStepOrThrow(stepId);
    }
    if (userId) {
      manualRecord.user = await this.findUserOrThrow(userId);
    }

    return this.manualRecordRepository.save(manualRecord);
  }

  async remove(id: number) {
    const manualRecord = await this.findOne(id);
    return this.manualRecordRepository.remove(manualRecord);
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

  private async findStepOrThrow(stepId: number) {
    const step = await this.stepRepository.findOneBy({ id: stepId });
    if (!step) {
      throw new NotFoundException(`Step #${stepId} not found`);
    }
    return step;
  }

  private async findUserOrThrow(userId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User #${userId} not found`);
    }
    return user;
  }
}
