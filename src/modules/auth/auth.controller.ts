import { Req, Controller, Post, UseGuards } from '@nestjs/common';
import AuthPayloadDto from './dtos/auth.dto';
import { AuthService } from './auth.service';
import LocalAuthGuard from './guards/localAuth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Req() req: any) {
    return req.user;
  }
}
