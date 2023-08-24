import request from 'supertest';
import  dotenv from 'dotenv';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './../src/app.module';

dotenv.config({
  path: '.env.test',
});


describe('OrderDetail (e2e)', () => {
  let app;
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule], 
    }).compile();

    token = process.env.TOKEN as string; 

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/order-detail/order/:orderId (GET) should get order details by order ID', async () => {
    const orderId = '2c583486-2be9-42cc-bede-3aa3e304ab80'; 

    const response = await request(app.getHttpServer())
      .get(`/order-detail/order/${orderId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toMatchObject({
    });
  });

});
