import { Strategy } from 'passport-local';
import { AuthService } from './auth/auth.service';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {

  constructor(
      private readonly authService: AuthService) {
    super({
      usernameField: 'username',
      passwordField: 'password',
    });
  }

  public async validate(username: string, password: string) {
    try {
      return await this.authService.validateUser(username, password);
    } catch(err) {
      throw new UnauthorizedException(err);
    }
  }

}
