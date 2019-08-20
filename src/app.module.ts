import { Module } from '@nestjs/common';
import { resolve } from 'path';
import { NedbModule } from '@hungtcs-box/nest-nedb';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from './modules/config/config.module';
import { AppController } from './app.controller';
import { ExplorerModule } from './modules/explorer/explorer.module';
import { VideoStreamModule } from './modules/video-stream/video-stream.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ConfigModule,
    ExplorerModule,
    VideoStreamModule,
    NedbModule.forRoot(`${ resolve(__dirname, '../dbs') }`),
  ],
  providers: [],
  controllers: [
    AppController,
  ],
})
export class AppModule {

}
