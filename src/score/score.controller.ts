import { Controller, 
    Delete, 
    Param, 
    Patch, 
    Body, 
    Get,
    UseGuards,
    Post} from '@nestjs/common';
import { ScoreService } from './score.service';
import { PrismaClient, Product, Order } from '@prisma/client';
import { CreateScoreDto } from './dto/create-score';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { Role } from '../auth/enums';
import { Auth } from '../auth/decorator';
import { AccessTokenGuard } from '../auth/guard/accessToken.guard';

@ApiTags('Score')
@UseGuards(AccessTokenGuard)
@Controller('score')
export class ScoreController {
    constructor(private scoreService: ScoreService) {}

    @ApiParam( {name: 'dto', type: CreateScoreDto})
    @Post()
    @Auth(Role.ADMIN, Role.EMPLOYEE)
    createScore(
        @Body() createScoreDto: CreateScoreDto
    ){
        return this.scoreService.createScore(createScoreDto);
    }
}
