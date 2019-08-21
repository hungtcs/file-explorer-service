import { join } from 'path';
import { Module } from '@nestjs/common';
import { FileService } from './services/file/file.service';
import { ConfigModule } from '../config/public_api';
import { MulterModule } from '@nestjs/platform-express';
import { ExplorerController } from './controllers/explorer/explorer.controller';

@Module({
  imports: [
    ConfigModule,
    MulterModule.register({
      dest: `${ join(__dirname, '../../../uploadFiles') }`,
    }),
  ],
  providers: [
    FileService,
  ],
  controllers: [
    ExplorerController,
  ],
})
export class ExplorerModule {

}
