import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { uniqueEmailValidation } from './validations/uniqueEmail.validation';
import { GlobalProviderModule } from './global-provider/global-provider.module';
import { ThreadModule } from './thread/thread.module';
import { JwtMiddleWare } from './middlewares/jwt.middleware';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [PrismaModule, AuthModule, GlobalProviderModule, ThreadModule, CommentModule],
  controllers: [AppController],
  providers: [AppService, uniqueEmailValidation],
  exports: []
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleWare).exclude('auth/(.*)').forRoutes('*');
  }
}
