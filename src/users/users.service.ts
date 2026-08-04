import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthenticatedUser } from '../auth/decorators/current-user.decorator';
import { branchScope } from '../auth/utils/branch-scope.util';

const SALT_ROUNDS = 10;
const REGISTRATION_NUMBER_LENGTH = 6;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { branch_id, name, role, email, password } = createUserDto;

    if (branch_id) {
      await this.findBranchOrThrow(branch_id);
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const registrationNumber = await this.generateRegistrationNumber();

    return this.prisma.user.create({
      data: {
        name,
        role,
        email,
        password: hashedPassword,
        registrationNumber,
        branchId: branch_id,
      },
    });
  }

  findAll(currentUser: AuthenticatedUser) {
    return this.prisma.user.findMany({
      where: branchScope(currentUser),
      include: { branch: true },
    });
  }

  async findOne(id: number, currentUser: AuthenticatedUser) {
    const user = await this.prisma.user.findFirst({
      where: { id, ...branchScope(currentUser) },
      include: { branch: true },
    });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    currentUser: AuthenticatedUser,
  ) {
    await this.findOne(id, currentUser);
    const { branch_id, password, ...rest } = updateUserDto;

    if (branch_id) {
      await this.findBranchOrThrow(branch_id);
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        ...rest,
        ...(branch_id ? { branchId: branch_id } : {}),
        ...(password
          ? { password: await bcrypt.hash(password, SALT_ROUNDS) }
          : {}),
      },
    });
  }

  async remove(id: number, currentUser: AuthenticatedUser) {
    await this.findOne(id, currentUser);
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

  private async generateRegistrationNumber(): Promise<string> {
    let candidate: string;
    let exists: boolean;

    do {
      candidate = randomBytes(REGISTRATION_NUMBER_LENGTH)
        .toString('hex')
        .slice(0, REGISTRATION_NUMBER_LENGTH)
        .toUpperCase();
      exists = Boolean(
        await this.prisma.user.findUnique({
          where: { registrationNumber: candidate },
        }),
      );
    } while (exists);

    return candidate;
  }
}
