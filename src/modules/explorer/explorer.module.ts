import { Module } from '@nestjs/common';
import { FileService } from './services/file/file.service';
import { ConfigModule } from '../config/public_api';
import { ExplorerController } from './controllers/explorer/explorer.controller';

@Module({
  imports: [
    ConfigModule,
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
