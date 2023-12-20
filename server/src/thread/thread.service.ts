import { Injectable } from '@nestjs/common';
import { ResponseService } from 'src/global-provider/responses.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { threadCreationDto } from './dto/threadCreation.dto';
import { threadDeletionDto } from './dto/threadDeletion.dto';
import { threadEditionDto } from './dto/threadEdition.dto';
import { ThreadModel } from 'src/constants';

@Injectable()
export class ThreadService {
  constructor(
    private prisma: PrismaService,
    private response: ResponseService,
  ) { }

  async getThreadsWithPagination(skip: string, take: string, search: string, order_by: string, order: string) {
    try {
      let filter_object = {};
      if (search && search.length) {
        filter_object["where"] = {
          OR: [{ heading: { contains: search } }, { content: { contains: search } }]
        }
      }
      if (order_by && order_by.length) {
        filter_object["orderBy"] = {
          [`${order_by}`]: order === "desc" ? "desc" : "asc"
        }
      }
      let threads_count = await this.prisma.thread.findMany(filter_object);
      filter_object = {...filter_object , skip: skip ? parseInt(skip) : 0, take: take ? parseInt(take) : 10, select: ThreadModel }
      let threads = await this.prisma.thread.findMany(filter_object);
      return this.response.success('Fetched threads successfully',{records:threads, total_records:threads_count.length});
    } catch (error) {
      console.log(error);
      return this.response.systemError(error);
    }
  }

  async getThread(id: string) {
    try {
      let thread = await this.prisma.thread.findFirst({ where: { id }, select: { heading: true, liked_by: true, disliked_by: true } });
      if (!thread) {
        return this.response.error('Sorry, No such thread found');
      }
      return this.response.success('Thread found successfully', thread);
    } catch (error) {
      console.log(error);
      return this.response.systemError(error);
    }
  }

  async create(thread: threadCreationDto) {
    try {
      const new_thread = await this.prisma.thread.create({ data: thread });
      return this.response.success('Thread created successfully.', new_thread);
    } catch (error) {
      console.log(error);
      return this.response.systemError(error);
    }
  }

  async delete(thread: threadDeletionDto) {
    try {
      let thread_to_delete = await this.prisma.thread.findFirst({
        where: { id: thread.thread_id, user_id: thread.user_id },
      });
      if (!thread_to_delete) {
        return this.response.error('Sorry, no such thread found.');
      }

      let comments_to_delete = await this.prisma.comment.findMany({
        where: { thread_id: thread_to_delete.id },
      });
      for (let comment of comments_to_delete) {
        await this.deleteComment(comment.id);
      }
      await this.prisma.comment.deleteMany({
        where: { thread_id: thread_to_delete.id },
      });
      await this.prisma.thread.delete({ where: { id: thread_to_delete.id } });

      return this.response.success('Thread deleted successfully.', '');
    } catch (error) {
      console.log(error);
      return this.response.systemError(error);
    }
  }

  async edit(thread: threadEditionDto) {
    try {
      let thread_to_edit = await this.prisma.thread.findFirst({
        where: { id: thread.thread_id, user_id: thread.user_id },
      });
      if (!thread_to_edit) {
        return this.response.error('Sorry, no such thread found.');
      }
      delete thread['thread_id'];
      await this.prisma.thread.update({
        where: { id: thread_to_edit.id },
        data: thread,
      });
      return this.response.success('Thread Updated successfully.', '');
    } catch (error) {
      console.log(error);
      return this.response.systemError(error);
    }
  }

  async deleteComment(id: string) {
    try {
      let comments_on_comment = await this.prisma.comment.findMany({
        where: { comment_id: id },
      });
      if (comments_on_comment.length) {
        for (let comment of comments_on_comment) {
          await this.deleteComment(comment.id);
        }
        await this.prisma.comment.deleteMany({ where: { comment_id: id } });
        return;
      }
      return;
    } catch (error) {
      console.log(error);
      return;
    }
  }

  async likeThread(thread_id: string, user_id: string) {
    try {
      let thread = await this.prisma.thread.findFirst({ where: { id: thread_id } });
      if (!thread) {
        return this.response.error('Sorry, no such thread found.');
      }
      let liked_thread = await this.prisma.likedThread.findFirst({ where: { thread_id, user_id } });
      if (liked_thread) {
        return this.response.error('Sorry, like already exist.');
      }
      let deleted = await this.prisma.dislikedThread.deleteMany({ where: { thread_id, user_id } })
      await this.prisma.thread.update({ where: { id: thread.id }, data: { likes: thread.likes + 1, dislikes: deleted?.count ? thread.dislikes - 1 : thread.dislikes } })
      await this.prisma.likedThread.create({ data: { thread_id, user_id } })
      return this.response.success('Thread liked successfully.', "");
    } catch (error) {
      console.log(error);
      return this.response.systemError(error);
    }
  }

  async dislikeThread(thread_id: string, user_id: string) {
    try {
      let thread = await this.prisma.thread.findFirst({ where: { id: thread_id } });
      if (!thread) {
        return this.response.error('Sorry, no such thread found.');
      }
      let disliked_thread = await this.prisma.dislikedThread.findFirst({ where: { thread_id, user_id } });
      if (disliked_thread) {
        return this.response.error('Sorry, dislike already exist.');
      }
      let deleted = await this.prisma.likedThread.deleteMany({ where: { thread_id, user_id } });
      await this.prisma.thread.update({ where: { id: thread.id }, data: { dislikes: thread.dislikes + 1, likes: deleted?.count ? thread.likes - 1 : thread.likes } })
      await this.prisma.dislikedThread.create({ data: { thread_id, user_id } })
      return this.response.success('Thread disliked successfully.', "");
    } catch (error) {
      console.log(error);
      return this.response.systemError(error);
    }
  }
}
