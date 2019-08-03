import { Module } from '@nestjs/common';
import { SharedModule } from './shared/shared.module';
import { AppController } from './app.controller';
import { FileTraversalModule } from './modules/file-traversal/file-traversal.module';
import { VideoStreamModule } from './modules/video-stream/video-stream.module';

@Module({
  imports: [
    SharedModule,
    VideoStreamModule,
    FileTraversalModule,
  ],
  providers: [],
  controllers: [AppController],
})
export class AppModule {

}
