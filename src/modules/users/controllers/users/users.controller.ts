import { UserModel } from '../../models/user.model';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from '../../services/users/users.service';
import { Controller, Put, Body, HttpException, HttpStatus, UseGuards, Delete, Param } from '@nestjs/common';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {

  constructor(
      private readonly usersService: UsersService) {

  }

  @Put()
  public async createUser(@Body() user: UserModel) {
    try {
      return await this.usersService.create(user);
    } catch(err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  public async deletUser(@Param('id') id: string) {
    try {
      return await this.usersService.delete(id);
    } catch(err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

}
