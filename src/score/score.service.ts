import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateScoreDto } from './dto/create-score';

@Injectable()
export class ScoreService {
    constructor(private prisma: PrismaService) {}

    async createScore(
        createScoreDto: CreateScoreDto
        ){
            const { userId, points } = createScoreDto;
            const newScore = await this.prisma.score.create({
                data: {
                    user: {
                        connect: {
                            id: userId
                        }
                    },
                    points: points,
                },
            });
            return newScore;
        }
}
