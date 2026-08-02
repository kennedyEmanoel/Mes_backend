import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ManualRecordService } from './manual-record.service';
import { CreateManualRecordDto } from './dto/create-manual-record.dto';
import { UpdateManualRecordDto } from './dto/update-manual-record.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/decorators/current-user.decorator';

@Controller('manual-record')
export class ManualRecordController {
  constructor(private readonly manualRecordService: ManualRecordService) {}

  @Post()
  create(
    @Body() createManualRecordDto: CreateManualRecordDto,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.manualRecordService.create(createManualRecordDto, currentUser);
  }

  @Get()
  findAll(@CurrentUser() currentUser: AuthenticatedUser) {
    return this.manualRecordService.findAll(currentUser);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.manualRecordService.findOne(+id, currentUser);
  }

  @Roles('manager', 'analyst', 'admin')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateManualRecordDto: UpdateManualRecordDto,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.manualRecordService.update(
      +id,
      updateManualRecordDto,
      currentUser,
    );
  }

  @Roles('manager', 'analyst', 'admin')
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.manualRecordService.remove(+id, currentUser);
  }
}
