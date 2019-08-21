import { Module } from '@nestjs/common';
import { VideoStreamController } from './controllers/video-stream/video-stream.controller';

@Module({
  controllers: [
    VideoStreamController,
  ],
})
export class VideoStreamModule {

}
