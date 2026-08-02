import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createProductDto: CreateProductDto) {
    const { commercial_name, ...rest } = createProductDto;
    return this.prisma.product.create({
      data: { ...rest, commercialName: commercial_name },
    });
  }

  findAll() {
    return this.prisma.product.findMany();
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    await this.findOne(id);
    const { commercial_name, ...rest } = updateProductDto;
    return this.prisma.product.update({
      where: { id },
      data: { ...rest, commercialName: commercial_name },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.product.delete({ where: { id } });
  }
}
