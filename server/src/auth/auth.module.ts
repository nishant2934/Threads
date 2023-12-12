import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { env } from 'process';

@Module({
  imports:[JwtModule.register({global: true,secret: env.JWT_SECRET,signOptions: { expiresIn: '24h'}})],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
