import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './../src/app.module';
import  dotenv from 'dotenv';

dotenv.config({
  path: '.env.test',
});


describe('Promo (e2e)', () => {
    let app;
    let token: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
          imports: [AppModule],
        }).compile();
    
        app = moduleFixture.createNestApplication();
        await app.init();
    
        token = process.env.TOKEN as string; 
      });

    afterAll(async () => {
        await app.close();
    });

    it('/promo/actives/all (GET) should get all active promos', async () => {
        const response = await request(app.getHttpServer())
        .get('/promo/actives/all')
        .set('Authorization', `Bearer ${token}`)
        .expect(200); 

        expect(response.body).toBeInstanceOf(Array);
    });

    it('/promo/actives/:id/detail (GET) should get active promo detail by ID', async () => {
        const promoId = 'd2496a56-1d96-468e-91bf-4d1febaa8776'; 

        const response = await request(app.getHttpServer())
        .get(`/promo/actives/${promoId}/detail`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200); 

        expect(response.body).toMatchObject({

        });
    });

});