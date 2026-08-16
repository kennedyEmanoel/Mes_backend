import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductionOrderService } from './production-order.service';
import { CreateProductionOrderDto } from './dto/create-production-order.dto';
import { UpdateProductionOrderDto } from './dto/update-production-order.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/decorators/current-user.decorator';

@Controller('production-order')
export class ProductionOrderController {
  constructor(
    private readonly productionOrderService: ProductionOrderService,
  ) {}

  @Roles('manager', 'analyst', 'admin')
  @Post()
  create(
    @Body() createProductionOrderDto: CreateProductionOrderDto,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.productionOrderService.create(
      createProductionOrderDto,
      currentUser,
    );
  }

  @Get()
  findAll(@CurrentUser() currentUser: AuthenticatedUser) {
    return this.productionOrderService.findAll(currentUser);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.productionOrderService.findOne(+id, currentUser);
  }

  @Roles('manager', 'analyst', 'admin')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductionOrderDto: UpdateProductionOrderDto,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.productionOrderService.update(
      +id,
      updateProductionOrderDto,
      currentUser,
    );
  }

  @Roles('manager', 'analyst', 'admin')
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.productionOrderService.remove(+id, currentUser);
  }
}
