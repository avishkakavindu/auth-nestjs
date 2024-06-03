import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/createUserDto.dto';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User), // Provide the token for the User entity
          useClass: Repository, // Mock the Repository class
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password',
      };

      const expectedResult = {
        id: '1',
        ...createUserDto,
        hashPassword: async () => {},
      };

      // Mock the implementation of userService.create method
      jest.spyOn(userService, 'create').mockResolvedValue(expectedResult);

      // Call the controller method
      const result = await userController.create(createUserDto);

      // Assertions
      expect(userService.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(expectedResult);
    });
  });
});
