import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('data')
  async getData() {
    const users = await this.appService.getUsers();
    return {
      message: 'Hello from the NestJS API!',
      timestamp: new Date().toISOString(),
      data: users,
    };
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
