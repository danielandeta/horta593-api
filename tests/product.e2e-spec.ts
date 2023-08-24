import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import  dotenv from 'dotenv';

dotenv.config({
  path: '.env.test',
});


describe('Product (e2e)', () => {
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

  it('/product/:id (GET) should get a product by ID', async () => {
    const productId = '0e5a750f-6800-4471-a1a3-f8279dfc5ac8'; 

    const response = await request(app.getHttpServer())
      .get(`/product/${productId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toMatchObject({
    });
  });

  it('/product (GET) should get all products', async () => {
    const response = await request(app.getHttpServer())
      .get('/product')
      .set('Authorization', `Bearer ${token}`)
      .expect(200); 

    expect(response.body).toBeInstanceOf(Array);

  });

});
