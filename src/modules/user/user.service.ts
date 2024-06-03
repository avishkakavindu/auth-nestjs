import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto, UpdateUserDto } from './dtos/createUserDto.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async findById(id: string) {
    return this.userRepo.findOne({ where: { id } });
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

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepo.create(createUserDto);
    return await this.userRepo.save(user);
  }

  async update(id: string, createUserDto: Partial<UpdateUserDto>) {
    return await this.userRepo.update(id, createUserDto);
  }
}
