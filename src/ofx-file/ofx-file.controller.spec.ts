import { Test, TestingModule } from '@nestjs/testing';
import { OfxFileController } from './ofx-file.controller';
import { OfxFileService } from './ofx-file.service';

describe('OfxFileController', () => {
  let controller: OfxFileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OfxFileController],
      providers: [OfxFileService],
    }).compile();

    controller = module.get<OfxFileController>(OfxFileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
