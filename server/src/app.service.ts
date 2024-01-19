import { Injectable } from '@nestjs/common';
import { env } from 'process';

@Injectable()
export class AppService {
  // testing the env change from .env to local.env
  async getHello() {
    return env.TEST;
  }
}
