import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto, UpdateUserDto } from './dtos/createUserDto.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async findById(id: string) {
    return this.userRepo.findOne({ where: { id } });
  }

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepo.create(createUserDto);
    return await this.userRepo.save(user);
  }

  async update(id: string, createUserDto: Partial<UpdateUserDto>) {
    return await this.userRepo.update(id, createUserDto);
  }
}
