import { Test, TestingModule } from '@nestjs/testing';
import { PromoService } from '../src/promo/promo.service';
import { PrismaService } from '../src/prisma/prisma.service';
import { CreatePromoDto } from '../src/promo/dto/create_promo';


describe('PromoService', () => {
  let service: PromoService;
  let prismaService: PrismaService;
  let createPromoMock: jest.Mock;

  beforeEach(async () => {
    createPromoMock = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PromoService,
        {
          provide: PrismaService,
          useValue: {
            promo: {
              create: createPromoMock,
            },
          },
        },
      ],
    }).compile();

    service = module.get<PromoService>(PromoService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPromo', () => {
    it('should create a promo', async () => {
      const createPromoDto: CreatePromoDto = {
        id: 'promo-id',
        name: 'Promo Test',
        active: true,
      };

      const createdPromo = {
        id: 'promo-id',
        name: 'Promo Test',
        active: true,
      };

      createPromoMock.mockResolvedValue(createdPromo);

      const result = await service.createPromo(createPromoDto);

      expect(result).toEqual(createdPromo);
    });
  });

});
