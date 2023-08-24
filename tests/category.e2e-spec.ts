import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import  dotenv from 'dotenv';

dotenv.config({
  path: '.env.test',
});


describe('Category (e2e)', () => {
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

  it('/category (GET) should get all categories', async () => {
    const response = await request(app.getHttpServer())
    .get('/category')
    .set('Authorization', `Bearer ${token}`)
    .expect(200);

    expect(response.body).toBeInstanceOf(Array);
  });

  it('/category/:id (GET) should get category by ID', async () => {
    const categoryId = '4cacae7d-82b9-4fce-9384-324736013396'; 

    const response = await request(app.getHttpServer())
      .get(`/category/${categoryId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toMatchObject({
    });
  });

  it('/category/:id/products (GET) should get products by category ID', async () => {
    const categoryId = '4cacae7d-82b9-4fce-9384-324736013396'; 

    const response = await request(app.getHttpServer())
      .get(`/category/${categoryId}/products`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
  });

});
