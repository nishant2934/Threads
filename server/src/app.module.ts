import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { uniqueEmailvalidation } from './validations/uniqueEmail.validation';
import { GlobalProviderModule } from './global-provider/global-provider.module';

@Module({
  imports: [PrismaModule, AuthModule, GlobalProviderModule],
  controllers: [AppController],
  providers: [AppService,uniqueEmailvalidation],
  exports:[]
})
export class AppModule {}
