import { Module } from '@nestjs/common';
import { ScoreService } from './score.service';
import { ScoreController } from './score.controller';

@Module({
  providers: [ScoreService],
  controllers: [ScoreController]
})
export class ScoreModule {}
