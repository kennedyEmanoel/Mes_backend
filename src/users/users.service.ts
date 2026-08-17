import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthenticatedUser } from '../auth/decorators/current-user.decorator';
import { branchScope } from '../auth/utils/branch-scope.util';

const SALT_ROUNDS = 10;
const REGISTRATION_NUMBER_LENGTH = 6;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto, currentUser: AuthenticatedUser) {
    const { branch_id, name, role, email, password } = createUserDto;

    if (currentUser.role !== 'admin') {
      if (role === 'admin') {
        throw new ForbiddenException(
          'Only admins can create users with the admin role',
        );
      }
      if (branch_id !== currentUser.branchId) {
        throw new ForbiddenException(
          'You can only create users in your own branch',
        );
      }
    }

    if (branch_id) {
      await this.findBranchOrThrow(branch_id);
    }

    return this.createUserRecord({
      name,
      role,
      email,
      password,
      branchId: branch_id,
    });
  }

  async register(registerUserDto: RegisterUserDto) {
    const { name, email, password, branch_id } = registerUserDto;

    await this.findBranchOrThrow(branch_id);

    return this.createUserRecord({
      name,
      role: 'operator',
      email,
      password,
      branchId: branch_id,
    });
  }

  findAll(currentUser: AuthenticatedUser) {
    return this.prisma.user.findMany({
      where: branchScope(currentUser),
      include: { branch: true },
      omit: { password: true },
    });
  }

  async findOne(id: number, currentUser: AuthenticatedUser) {
    const user = await this.prisma.user.findFirst({
      where: { id, ...branchScope(currentUser) },
      include: { branch: true },
      omit: { password: true },
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
    const target = await this.findOne(id, currentUser);
    const { branch_id, password, role, ...rest } = updateUserDto;

    if (currentUser.role !== 'admin') {
      if (target.role === 'admin' || role === 'admin') {
        throw new ForbiddenException(
          'Only admins can manage users with the admin role',
        );
      }
      if (branch_id !== undefined && branch_id !== currentUser.branchId) {
        throw new ForbiddenException(
          'You can only manage users in your own branch',
        );
      }
    }

    if (branch_id) {
      await this.findBranchOrThrow(branch_id);
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        ...rest,
        ...(role ? { role } : {}),
        ...(branch_id ? { branchId: branch_id } : {}),
        ...(password
          ? { password: await bcrypt.hash(password, SALT_ROUNDS) }
          : {}),
      },
      omit: { password: true },
    });
  }

  async remove(id: number, currentUser: AuthenticatedUser) {
    const target = await this.findOne(id, currentUser);

    if (currentUser.role !== 'admin' && target.role === 'admin') {
      throw new ForbiddenException(
        'Only admins can remove users with the admin role',
      );
    }

    return this.prisma.user.delete({ where: { id }, omit: { password: true } });
  }

  private async createUserRecord(data: {
    name: string;
    role: string;
    email: string;
    password: string;
    branchId?: number;
  }) {
    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);
    const registrationNumber = await this.generateRegistrationNumber();

    return this.prisma.user.create({
      data: {
        name: data.name,
        role: data.role,
        email: data.email,
        password: hashedPassword,
        registrationNumber,
        branchId: data.branchId,
      },
      omit: { password: true },
    });
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
