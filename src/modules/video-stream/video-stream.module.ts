import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/public_api';
import { VideoStreamController } from './controllers/video-stream/video-stream.controller';

@Module({
  imports: [
    ConfigModule,
  ],
  controllers: [
    VideoStreamController,
  ],
})
export class VideoStreamModule {

}
