import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePromoDto } from "./dto/create_promo";

@Injectable()
export class PromoService {
    constructor(private prisma: PrismaService) {}

    async createPromo(data: CreatePromoDto) {
        return this.prisma.promo.create({ data });
    }

    async getAllActivePromos() {
        return this.prisma.promo.findMany({ where: { active: true } });
    }

    async getActivePromoDetail(id: string) {
        return this.prisma.promo.findFirst({ where: { id, active: true } });
    }

    async togglePromoActiveStatus(id: string) {
        const promo = await this.prisma.promo.findUnique({ where: { id } });

        if (!promo) {
        throw new NotFoundException(`Promo with ID ${id} not found`);
        }

        const updatedPromo = await this.prisma.promo.update({
        where: { id },
        data: { active: !promo.active },
        });

        return updatedPromo;
    }

    async updatePromo(id: string, name: string) {
        const promo = await this.prisma.promo.findUnique({ where: { id } });
    
        if (!promo) {
            throw new NotFoundException(`Promo with ID ${id} not found`);
        }
    
        return this.prisma.promo.update({
            where: { id },
            data: { name },
        });
    }

    async deletePromo(id: string) {
        const promo = await this.prisma.promo.findUnique({ where: { id } });
    
        if (!promo) {
            throw new NotFoundException(`Promo with ID ${id} not found`);
        }
    
        return this.prisma.promo.delete({ where: { id } });
    }
}
