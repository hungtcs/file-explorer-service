import DataStore from 'nedb';
import { promisify } from 'util';
import { UserModel } from '../../models/user.model';
import { Injectable } from '@nestjs/common';
import { plainToClass, classToPlain } from 'class-transformer';
import { PasswdService } from '../../../../shared/public_api';
import { InjectDatastore } from '@hungtcs-box/nest-nedb';

@Injectable()
export class UsersService {

  constructor(
      private readonly passwdService: PasswdService,
      @InjectDatastore(UserModel) private readonly dataStore: DataStore<UserModel>,) {

  }

  public async create(user: UserModel) {
    user.passwordHash = await this.passwdService.generateHash(user.password);
    return await promisify<UserModel, UserModel>(this.dataStore.insert.bind(this.dataStore))(classToPlain(user));
  }

  public async delete(id: string) {
    return await promisify<UserModel, number>(this.dataStore.remove.bind(this.dataStore))({ _id: id });
  }

  public async findByUsername(username: string) {
    const user = await promisify<UserModel, UserModel>(this.dataStore.findOne.bind(this.dataStore))({ username });
    return plainToClass(UserModel, user);
  }

}
