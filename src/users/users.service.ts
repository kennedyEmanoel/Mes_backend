import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Branch } from '../branches/entities/branch.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { branch_id, ...rest } = createUserDto;
    const user = this.userRepository.create(rest);

    if (branch_id) {
      user.branch = await this.findBranchOrThrow(branch_id);
    }

    return this.userRepository.save(user);
  }

  findAll() {
    return this.userRepository.find({ relations: ['branch'] });
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['branch'],
    });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    const { branch_id, ...rest } = updateUserDto;
    Object.assign(user, rest);

    if (branch_id) {
      user.branch = await this.findBranchOrThrow(branch_id);
    }

    return this.userRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    return this.userRepository.remove(user);
  }

  private async findBranchOrThrow(branchId: number) {
    const branch = await this.branchRepository.findOneBy({ id: branchId });
    if (!branch) {
      throw new NotFoundException(`Branch #${branchId} not found`);
    }
    return branch;
  }
}
