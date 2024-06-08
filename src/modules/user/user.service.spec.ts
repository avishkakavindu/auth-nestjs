import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserDto, UpdateUserDto } from './dtos/createUserDto.dto';

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

const mockUserRepository = {
  create: jest.fn().mockImplementation((userData: CreateUserDto) => {
    const user = new User();
    user.firstName = userData.firstName;
    user.lastName = userData.lastName;
    user.email = userData.email;
    user.password = 'hashedPassword';
    return user;
  }),
  save: jest.fn().mockImplementation((user) => {
    return Promise.resolve({ id: '1', ...user });
  }),
  findOne: jest.fn().mockImplementation((query: { where: { id: string } }) => {
    const { where } = query;
    const user = mockUsers.find((user) => user.id === where.id);
    return user;
  }),
  find: jest.fn().mockResolvedValue([mockUser]),
  update: jest.fn(),
};

describe('UserService', () => {
  let userService: UserService;
  let userRepo: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepo = module.get<Repository<User>>(getRepositoryToken(User));

    // Clear all mocks before each test to ensure isolation
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('create', () => {
    it('should create a user successfully when valid data is provided', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password',
      };

      /**
       * mock `bcrypt.hash`. whenever bcrypt.hash is called,
       * it should resolve with the value 'hashedPassword'
       */
      const bcryptHashSpy = jest.spyOn(bcrypt, 'hash') as jest.Mock;
      bcryptHashSpy.mockResolvedValue('hashedPassword');

      const result = await userService.create(createUserDto);

      expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 10);
      expect(userRepo.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: 'hashedPassword',
      });
      expect(userRepo.save).toHaveBeenCalledWith({
        ...createUserDto,
        password: 'hashedPassword',
      });

      expect(result).toEqual(mockUser);
    });
  });

  describe('findById', () => {
    it('should be able to find user by id', async () => {
      const userId = '1';

      const result = await userService.findById(userId);

      expect(userRepo.findOne).toHaveBeenCalledWith({ where: { id: userId } });
      expect(result.id === userId);
    });

    it('should throw NotFoundException if user is not found', async () => {
      const userId = 'nonExistentUserId';

      // Mock the findOne method of the repository to return undefined
      jest.spyOn(userRepo, 'findOne').mockResolvedValue(undefined);

      await expect(userService.findById(userId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      // Mock the find method of the repository to return the mock users
      jest.spyOn(userRepo, 'find').mockResolvedValue(mockUsers);

      const result = await userService.findAll();

      expect(userRepo.find).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });

    it('should return an empty array if no users are found', async () => {
      const mockEmptyArray: User[] = [];

      // Mock the find method of the repository to return an empty array
      jest.spyOn(userRepo, 'find').mockResolvedValue(mockEmptyArray);

      const result = await userService.findAll();

      expect(userRepo.find).toHaveBeenCalled();
      expect(result).toEqual(mockEmptyArray);
    });
  });

  describe('update', () => {
    it('should update user if user is found', async () => {
      const userId = '1';
      const updateUserDto: Partial<UpdateUserDto> = {
        firstName: 'Updated John',
        lastName: 'Updated Doe',
        email: 'updatedjohn@example.com',
      };

      // Mock the update method of the repository to return the raw result
      jest.spyOn(userRepo, 'update').mockResolvedValue({
        raw: [{ id: userId, ...mockUser, ...updateUserDto }],
        affected: 1, // Indicates the number of affected rows (1 in this case)
        generatedMaps: [], // Can be an empty array as we are not using generated maps);
      });

      const result = await userService.update(userId, updateUserDto);

      expect(userRepo.update).toHaveBeenCalledWith(userId, updateUserDto);
      expect(result).toEqual({ id: userId, ...mockUser, ...updateUserDto });
    });

    it('should throw NotFoundException if user is not found', async () => {
      // Arrange
      const userId = 'nonExistentUserId';
      const updateUserDto: Partial<UpdateUserDto> = {
        firstName: 'Updated John',
        lastName: 'Updated Doe',
        email: 'updatedjohn@example.com',
      };

      // Mock the update method of the repository to return empty raw result
      jest.spyOn(userRepo, 'update').mockResolvedValue({
        raw: [],
        affected: 0, // Indicates the number of affected rows (0 in this case)
        generatedMaps: [], // Empty array for generated maps
      });

      await expect(userService.update(userId, updateUserDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
