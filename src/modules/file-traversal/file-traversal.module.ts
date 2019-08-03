import { Module } from '@nestjs/common';
import { FileTraversalController } from './file-traversal/file-traversal.controller';
import { FileService } from './services/public_api';

@Module({
  providers: [
    FileService,
  ],
  controllers: [
    FileTraversalController,
  ],
})
export class FileTraversalModule {
  
}
