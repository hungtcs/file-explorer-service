import { Module } from '@nestjs/common';
import { VideoStreamController } from './video-stream/video-stream.controller';

@Module({
  controllers: [VideoStreamController]
})
export class VideoStreamModule {

}
