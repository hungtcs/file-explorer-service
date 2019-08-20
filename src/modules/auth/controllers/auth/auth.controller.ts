import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../../services/auth/auth.service';
import { Controller, UseGuards, Req, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {

  constructor(
      private readonly authService: AuthService) {

  }

  @Post()
  @UseGuards(AuthGuard('local'))
  public async auth(@Req() request: Request) {
    return {
      token: await this.authService.getToken(request.user),
    };
  }


}
