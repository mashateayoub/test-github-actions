import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('data')
  getData() {
    return {
      message: 'Hello from the NestJS API!',
      timestamp: new Date().toISOString(),
      data: [
        { name: 'John Doe', age: 30 },
        { name: 'Jane Boe', age: 25 },
        { name: 'John Moe', age: 30 },
      ],
    };
  }
}
