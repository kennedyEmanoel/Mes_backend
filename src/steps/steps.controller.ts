import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StepsService } from './steps.service';
import { CreateStepDto } from './dto/create-step.dto';
import { UpdateStepDto } from './dto/update-step.dto';
import { AssignUserDto } from './dto/assign-user.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/decorators/current-user.decorator';

@Controller('steps')
export class StepsController {
  constructor(private readonly stepsService: StepsService) {}

  @Roles('manager', 'analyst', 'admin')
  @Post()
  create(
    @Body() createStepDto: CreateStepDto,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.stepsService.create(createStepDto, currentUser);
  }

  @Get()
  findAll(@CurrentUser() currentUser: AuthenticatedUser) {
    return this.stepsService.findAll(currentUser);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.stepsService.findOne(+id, currentUser);
  }

  @Roles('manager', 'analyst', 'admin')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateStepDto: UpdateStepDto,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.stepsService.update(+id, updateStepDto, currentUser);
  }

  @Roles('manager', 'analyst', 'admin')
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.stepsService.remove(+id, currentUser);
  }

  @Roles('manager', 'analyst', 'admin')
  @Post(':id/assignments')
  assignUser(
    @Param('id') id: string,
    @Body() assignUserDto: AssignUserDto,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.stepsService.assignUser(
      +id,
      assignUserDto.user_id,
      currentUser,
    );
  }

  @Roles('manager', 'analyst', 'admin')
  @Delete(':id/assignments/:userId')
  unassignUser(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.stepsService.unassignUser(+id, +userId, currentUser);
  }
}
