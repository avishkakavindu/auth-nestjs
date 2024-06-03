import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import LoginPayloadDto from './dtos/auth.dto';
import { UserService } from '../user/user.service';
import { comparePassword } from './utils/login.utils';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findOneWithEmail(email, {
      includePwd: true,
    });

    if (!user) return null;

    const isCorrectPassword = await comparePassword(user.password, password);

    if (!isCorrectPassword) return null;
    // Remove password before returning user
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  generateTokens(user: User) {
    const payload = { sub: user.id, email: user.email };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
    });

    return { accessToken, refreshToken };
  }

  async loginUser(user: User) {
    const { accessToken, refreshToken } = this.generateTokens(user);
    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(user: User) {
    const { accessToken, refreshToken } = this.generateTokens(user);
    return {
      accessToken,
      refreshToken,
    };
  }
}
