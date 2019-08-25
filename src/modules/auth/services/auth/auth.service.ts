import { JwtService } from '@nestjs/jwt';
import { classToPlain } from 'class-transformer';
import { PasswdService } from '../../../../shared/public_api';
import { UsersService, UserModel } from '../../../users/public_api';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class AuthService {

  constructor(
      private readonly jwtService: JwtService,
      private readonly usersService: UsersService,
      private readonly passwdService: PasswdService) {

  }

  public async validateUser(username: string, password: string) {
    try {
      const user = await this.usersService.findByUsername(username);
      if(!user) {
        throw new HttpException('user not exists or password is invalid', HttpStatus.UNAUTHORIZED);
      }
      if(await this.passwdService.validatePassword(password, user.passwordHash)) {
        return user;
      } else {
        throw new HttpException('user not exists or password is invalid', HttpStatus.UNAUTHORIZED);
      }
    } catch(err) {
      throw err;
    }
  }

  public async getToken(user: UserModel) {
    const { password, passwordHash, ...shared } = user;
    return this.jwtService.sign({ ...shared });
  }

}
