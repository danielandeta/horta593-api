import { Test, TestingModule } from '@nestjs/testing';
import { ScoreService } from '../src/score/score.service';
import { PrismaService } from '../src/prisma/prisma.service';

describe('ScoreService', () => {
  let service: ScoreService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const prismaServiceMock = {
      score: {
        create: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScoreService,
        { provide: PrismaService, useValue: prismaServiceMock },
      ],
    }).compile();

    service = module.get<ScoreService>(ScoreService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createScore', () => {
    it('should create a score', async () => {
      const createScoreDto = {
        userId: '8c0da445-0065-4a34-b1c8-49dfca205d0e',
        points: 5,
      };

      const result = await service.createScore(createScoreDto);

      expect(prisma.score.create).toHaveBeenCalledWith({
        data: {
          user: {
            connect: {
              id: createScoreDto.userId,
            },
          },
          points: createScoreDto.points,
        },
      });
    });
  });
});
