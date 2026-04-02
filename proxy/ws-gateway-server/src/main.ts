import 'reflect-metadata';
import { ExpressAdapter } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import * as http from 'http';
import { AppModule } from './app.module';

class ProxyExpressAdapter extends ExpressAdapter {
  override initHttpServer(): void {
    this.httpServer = http.createServer(this.getInstance());
  }
}

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, new ProxyExpressAdapter());
  await app.listen(process.env.PORT ? Number(process.env.PORT) : 1212);
}

void bootstrap();
