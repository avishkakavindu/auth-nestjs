import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './dtos/createUserDto.dto';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UserController', () => {
  let userController: UserController;

  let userService: UserService;

  const mockUserService = {
    create: jest.fn(),
    update: jest.fn(),
    findById: jest.fn(),
    findOneWithEmail: jest.fn(),
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: getRepositoryToken(User), // Provide the token for the User entity
          useClass: Repository, // Mock the Repository class
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
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
      };

      jest.spyOn(userService, 'create').mockResolvedValue(expectedResult);

      const result = await userController.create(createUserDto);

      expect(userService.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(expectedResult);
    });
  });

  it('should update the user', async () => {
    const updateUserDto: Partial<UpdateUserDto> = {
      firstName: 'John',
      lastName: 'Smith',
    };

    const userId = '1';
    const expectedResult: User = {
      id: userId,
      firstName: 'John',
      lastName: 'Smith',
      email: 'john@example.com',
      password: 'password',
    };

    jest.spyOn(userService, 'update').mockResolvedValue(expectedResult);

    const result = await userController.update(userId, updateUserDto);

    expect(userService.update).toHaveBeenCalledWith(userId, updateUserDto);
    expect(result).toEqual(expectedResult);
  });

  it('should return user by id', async () => {
    const userId = '1';
    const expectedResult: User = {
      id: userId,
      firstName: 'John',
      lastName: 'Smith',
      email: 'john@example.com',
      password: 'password',
    };

    jest.spyOn(userService, 'findById').mockResolvedValue(expectedResult);
    const result = await userController.findById(userId);

    expect(userService.findById).toHaveBeenCalledWith(userId);
    expect(result).toEqual(expectedResult);
  });

  it('should return list of all users', async () => {
    const expectedResult: User[] = [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Smith',
        email: 'john@example.com',
        password: 'password',
      },
      {
        id: '2',
        firstName: 'Sam',
        lastName: 'Smith',
        email: 'sam@example.com',
        password: 'password',
      },
    ];

    jest.spyOn(userService, 'findAll').mockResolvedValue(expectedResult);
    const result = await userController.findAll();

    expect(userService.findAll).toHaveBeenCalled();
    expect(result).toEqual(expectedResult);
  });
});
