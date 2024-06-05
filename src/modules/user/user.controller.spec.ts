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

  const mockUser: User = new User();
  mockUser.id = '1';
  mockUser.firstName = 'John';
  mockUser.lastName = 'Doe';
  mockUser.email = 'john@example.com';
  mockUser.password = 'hashedPassword';

  const mockUsers: User[] = [
    mockUser,
    {
      id: '2',
      firstName: 'Sam',
      lastName: 'Smith',
      email: 'sam@example.com',
      password: 'hashedPassword',
    },
  ];

  const mockUserService = {
    create: jest.fn().mockImplementation((userData: CreateUserDto) => {
      return Promise.resolve({
        id: '1',
        ...userData,
        password: 'hashedPassword',
      });
    }),
    update: jest
      .fn()
      .mockImplementation((id: string, userData: UpdateUserDto) => {
        const user = mockUsers.find((user) => user.id === id);
        return Promise.resolve({
          ...user,
          ...userData,
        });
      }),
    findById: jest.fn().mockImplementation((id: string) => {
      const user = mockUsers.find((user) => user.id === id);
      return Promise.resolve(user);
    }),
    findOneWithEmail: jest.fn().mockImplementation((email: string) => {
      const user = mockUsers.find((user) => user.email === email);
      return Promise.resolve(user);
    }),
    findAll: jest.fn().mockImplementation(() => Promise.resolve(mockUsers)),
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

    // Clear all mocks before each test to ensure isolation
    jest.clearAllMocks();
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

      const result = await userController.create(createUserDto);
      expect(result).toEqual(mockUser);
      expect(mockUserService.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('update', () => {
    it('should update the user', async () => {
      const userId = '1';
      const updateUserDto: UpdateUserDto = {
        firstName: 'John',
        lastName: 'Smith',
      };

      const user = mockUsers.find((user) => user.id === userId);
      const expectedResult = { ...user, ...updateUserDto };
      const result = await userController.update(userId, updateUserDto);

      expect(result).toEqual(expectedResult);
      expect(mockUserService.update).toHaveBeenCalledWith(
        userId,
        updateUserDto,
      );
    });
  });

  describe('findById', () => {
    it('should return user by id', async () => {
      const userId = '1';
      const expectedResult = mockUsers.find((user) => user.id === userId);
      const result = await userController.findById(userId);

      expect(result).toEqual(expectedResult);
      expect(mockUserService.findById).toHaveBeenCalledWith(userId);
    });
  });

  describe('findAll', () => {
    it('should return list of all users', async () => {
      const expectedResult = mockUsers;
      const result = await userController.findAll();

      expect(result).toEqual(expectedResult);
      expect(userService.findAll).toHaveBeenCalled();
    });
  });
});
