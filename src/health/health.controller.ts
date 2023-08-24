import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator,
} from '@nestjs/terminus';
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private memory: MemoryHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.http.pingCheck('basic check', 'http://localhost:3000/'),
            () => this.memory.checkHeap('memory_heap', 300*1024*1024),
                  () => this.memory.checkRSS('memory_rss', 300*1024*1024),


    ]);
  }
}