import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dtos/createUserDto.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: Partial<UpdateUserDto>,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Get('all')
  findAll() {
    return 'all users';
  }
}
