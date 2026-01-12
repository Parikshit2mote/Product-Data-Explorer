import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(): any {
    return {
      message: 'Product Data Explorer Backend API',
      status: 'online',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('health')
  getHealth(): any {
    return { status: 'ok' };
  }
}
