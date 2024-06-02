import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super(); // configs
  }

  async validate(email: string, password: string) {
    const user = await this.authService.loginUser({ email, password });

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}

export default LocalStrategy;
