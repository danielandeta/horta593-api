import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller("/")
export class AppController {
  @Get()
  findAll(@Req() request: Request): Record<string, string> {
    return {message: 'Ok'};
  }
}