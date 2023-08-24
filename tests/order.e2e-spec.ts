import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import  dotenv from 'dotenv';

dotenv.config({
  path: '.env.test',
});

describe('Order (e2e)', () => {
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

  it('/order (GET) should get all orders', async () => {
    const response = await request(app.getHttpServer())
      .get('/order')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
  });

  it('/order/:id/orders/all (GET) should get all orders for a user', async () => {
    const userId = '4db692b3-cb12-47b9-9ef2-288def2a0169';

    const response = await request(app.getHttpServer())
      .get(`/order/${userId}/orders/all`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
  });

  it('/order/:orderId/status (GET) should get the status of an order', async () => {
    const orderId = '10bf1906-6451-441f-8145-545cc253b3f0';

    const response = await request(app.getHttpServer())
      .get(`/order/${orderId}/status`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toHaveProperty('status');
  });

  it('/order/status/finished (GET) should find orders with status finished', async () => {
    const response = await request(app.getHttpServer())
      .get('/order/status/finished')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toHaveProperty('orders');
    expect(response.body.orders).toBeInstanceOf(Array);
  });

});
