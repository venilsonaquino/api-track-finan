import { Test, TestingModule } from '@nestjs/testing';
import { OfxFileService } from './ofx-file.service';

describe('OfxFileService', () => {
  let service: OfxFileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OfxFileService],
    }).compile();

    service = module.get<OfxFileService>(OfxFileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
