import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';

@Injectable()
export class BranchesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createBranchDto: CreateBranchDto) {
    return this.prisma.branch.create({ data: createBranchDto });
  }

  findAll() {
    return this.prisma.branch.findMany();
  }

  async findOne(id: number) {
    const branch = await this.prisma.branch.findUnique({ where: { id } });
    if (!branch) {
      throw new NotFoundException(`Branch #${id} not found`);
    }
    return branch;
  }

  async update(id: number, updateBranchDto: UpdateBranchDto) {
    await this.findOne(id);
    return this.prisma.branch.update({
      where: { id },
      data: updateBranchDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.branch.delete({ where: { id } });
  }
}
