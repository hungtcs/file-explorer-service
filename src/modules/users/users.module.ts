import DataStore from 'nedb';
import { Module, Logger } from '@nestjs/common';
import { UserModel } from './models/user.model';
import { NedbModule } from '@hungtcs-box/nest-nedb';
import { UsersService } from './services/users/users.service';
import { UsersController } from './controllers/users/users.controller';
import { PasswdModule, PasswdService } from '../../shared/public_api';

@Module({
  imports: [
    PasswdModule,
    NedbModule.forFeature([
      {
        model: UserModel,
        indexes: {
          username: {
            unique: true,
          },
        },
      },
    ]),
  ],
  exports: [
    UsersService,
  ],
  providers: [
    {
      inject: [PasswdService, `NEDB_DATABASE_${ UserModel.name }`],
      provide: UsersService,
      useFactory: UsersModule.initAdminUserAndCreateUserService,
    },
  ],
  controllers: [
    UsersController,
  ],
})
export class UsersModule {

  public static async initAdminUserAndCreateUserService(passwdService: PasswdService, dataStore: DataStore<UserModel>) {
    const usersService = new UsersService(passwdService, dataStore);
    const user = await usersService.findByUsername('admin');
    if(!user) {
      Logger.log(`creating admin user`);
      await usersService.create({ username: 'admin', password: 'admin' });
    }
    return usersService;
  }

}
