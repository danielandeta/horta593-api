import { Controller, Post, Body, Get, Param, Put, UseGuards, Patch, Delete  } from '@nestjs/common';
import { PromoService } from './promo.service';
import { CreatePromoDto } from './dto/create_promo';
import { GetUser, Auth, RoleProtected } from '../auth/decorator';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { Role } from '../auth/enums';
import { AccessTokenGuard } from '../auth/guard/accessToken.guard';

@ApiTags('Promo')
@UseGuards(AccessTokenGuard)
@Controller('promo')
export class PromoController {
    constructor(private promoService: PromoService) {}

    @Post()
    @Auth(Role.ADMIN)
    create(@Body() createPromoDto: CreatePromoDto) {
        return this.promoService.createPromo(createPromoDto);
    }

    @Get('actives/all')
    getAllActive() {
        return this.promoService.getAllActivePromos();
    }

    @Get('actives/:id/detail')
    getActiveDetail(@Param('id') id: string) {
        return this.promoService.getActivePromoDetail(id);
    }

    @Put(':id/toggleActive')
    @Auth(Role.ADMIN)
    toggleActiveStatus(@Param('id') id: string) {
        return this.promoService.togglePromoActiveStatus(id);
    }

    @Patch(':id/update')
    @ApiParam({ name: 'id', type: String })
    @Auth(Role.ADMIN)
    updatePromo(@Param('id') id: string, @Body('name') name: string) {
        return this.promoService.updatePromo(id, name);
    }

    @Delete(':id/delete')
    @ApiParam({ name: 'id', type: String })
    @Auth(Role.ADMIN)
    deletePromo(@Param('id') id: string) {
        return this.promoService.deletePromo(id);
    }
}
