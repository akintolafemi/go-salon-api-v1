import { Test, TestingModule } from '@nestjs/testing';
import { SpecialistsController } from './specialists.controller';

describe('SpecialistsController', () => {
  let controller: SpecialistsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpecialistsController],
    }).compile();

    controller = module.get<SpecialistsController>(SpecialistsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
