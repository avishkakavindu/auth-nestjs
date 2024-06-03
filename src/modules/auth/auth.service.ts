import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import LoginPayloadDto from './dtos/auth.dto';
import { UserService } from '../user/user.service';
import { comparePassword } from './utils/login.utils';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findOneWithEmail(email, {
      includePwd: true,
    });

    if (!user) return null;

    const isCorrectPassword = await comparePassword(user.password, password);

    if (!isCorrectPassword) return null;
    return user;
  }

  async loginUser(user: User) {
    const payload = {
      email: user.email,
      sub: user.id, // the unique identifier of the user as the subject
    };

    return {
      user,
      accessToken: this.jwtService.sign(payload),
    };
  }
}
