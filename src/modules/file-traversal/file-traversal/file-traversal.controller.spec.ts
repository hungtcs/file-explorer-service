import { Test, TestingModule } from '@nestjs/testing';
import { FileTraversalController } from './file-traversal.controller';

describe('FileTraversal Controller', () => {
  let controller: FileTraversalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FileTraversalController],
    }).compile();

    controller = module.get<FileTraversalController>(FileTraversalController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
