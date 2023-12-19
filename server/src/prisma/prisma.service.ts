import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  userModel() {
    return {
      id: true,
      name: true,
      user_name: true,
      email: true,
      password: true,
      email_verified: true,
      otp: true,
      otp_created_at: true,
      // threads: true,
      // comments: true,
      // liked_threads_ids: true,
      // liked_threads: true,
      // disliked_threads_ids: true,
      // disliked_threads: true,
      // liked_comments_ids: true,
      // liked_comments: true,
      // disliked_comments_ids: true,
      // disliked_comments: true,
      // createdAt: true,
      // updatedAt: true
    };
  }
}