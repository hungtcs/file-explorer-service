import { Test, TestingModule } from '@nestjs/testing';
import { PasswdService } from './passwd.service';

describe('PasswdService', () => {
  let service: PasswdService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswdService],
    }).compile();

    service = module.get<PasswdService>(PasswdService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
