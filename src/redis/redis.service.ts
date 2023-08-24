import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';

@Injectable()
export class RedisService {
  redisClient;
  constructor(private config: ConfigService) {
    const redisHost = this.config.get<string>('REDIS_HOST');
    const redisPort = this.config.get<number>('REDIS_PORT');
    const redisUrl = `redis://${redisHost}:${redisPort}`;
    this.redisClient = createClient({ url: redisUrl });
    this.redisClient.on('error', (err) =>
      console.error('Redis Client Error', err),
    );
  }

  async onModuleInit() {
    await this.redisClient.connect();
  }

  async onModuleDestroy() {
    await this.redisClient.disconnect();
  }

  async set({ key, value, time }) {
    await this.redisClient.set(key, value, { EX: time });
  }

  async get(key) {
    const result = await this.redisClient.get(key);
    return result;
  }

  async del(key) {
    await this.redisClient.del(key);
  }
}
