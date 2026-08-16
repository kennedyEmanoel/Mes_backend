import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/decorators/current-user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles('manager', 'analyst', 'admin')
  @Post()
  create(
    @Body() createUserDto: CreateUserDto,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.usersService.create(createUserDto, currentUser);
  }

  @Get()
  findAll(@CurrentUser() currentUser: AuthenticatedUser) {
    return this.usersService.findAll(currentUser);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.usersService.findOne(+id, currentUser);
  }

  @Roles('manager', 'analyst', 'admin')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.usersService.update(+id, updateUserDto, currentUser);
  }

  @Roles('manager', 'analyst', 'admin')
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.usersService.remove(+id, currentUser);
  }
}
