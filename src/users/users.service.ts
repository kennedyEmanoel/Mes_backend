import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { branch_id, registration_number, name, role, email, password } =
      createUserDto;

    if (branch_id) {
      await this.findBranchOrThrow(branch_id);
    }

    return this.prisma.user.create({
      data: {
        name,
        role,
        email,
        password,
        registrationNumber: registration_number,
        branchId: branch_id,
      },
    });
  }

  findAll() {
    return this.prisma.user.findMany({ include: { branch: true } });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { branch: true },
    });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.findOne(id);
    const { branch_id, registration_number, ...rest } = updateUserDto;

    if (branch_id) {
      await this.findBranchOrThrow(branch_id);
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        ...rest,
        ...(registration_number
          ? { registrationNumber: registration_number }
          : {}),
        ...(branch_id ? { branchId: branch_id } : {}),
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.user.delete({ where: { id } });
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
}
