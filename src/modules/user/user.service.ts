import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { CreateUserDto, UpdateUserDto } from './dtos/createUserDto.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const data: CreateUserDto = {
      ...createUserDto,
      password: hashedPassword,
    };
    const user = this.userRepo.create(data);
    return await this.userRepo.save(user);
  }

  async findById(id: string) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findAll() {
    return this.userRepo.find();
  }

  /**
   * Find user by email address
   * @param {string} email - User email
   * @param {Object} options - Additional options
   * @param {boolean} options.includePwd - Whether to include password in the returned user object
   * @returns The user object if found, otherwise undefined
   */
  async findOneWithEmail(
    email: string,
    options: { includePwd?: boolean } = { includePwd: false },
  ) {
    const queryBuilder = this.userRepo
      .createQueryBuilder('user')
      .where('user.email = :email', { email });

    if (options.includePwd) {
      queryBuilder.addSelect('user.password'); // Include password if requested
    }

    return queryBuilder.getOne();
  }

  async update(id: string, updateUserDto: Partial<UpdateUserDto>) {
    const user = await this.userRepo.update(id, updateUserDto);

    if (!user.raw || user.raw.length === 0) {
      throw new NotFoundException('User not found');
    }

    return user.raw[0];
  }
}
