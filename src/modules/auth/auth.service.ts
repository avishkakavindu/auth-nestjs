import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import AuthPayloadDto from './dtos/auth.dto';

const mockUsers = [
  {
    id: 1,
    email: 'abc@123.com',
    password: 'abc@123',
  },
  {
    id: 2,
    email: 'abcd@123.com',
    password: 'abcd@123',
  },
];

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async loginUser(authPayload: AuthPayloadDto) {
    const { email, password } = authPayload;

    const findUser = mockUsers.find((user) => email === user.email);
    if (!findUser) {
      throw new HttpException('Invalid credentials', 401);
    }

    if (password === findUser.password) {
      const { password, ...rest } = findUser;
      return this.jwtService.sign(rest);
    }
    return false;
  }
}
