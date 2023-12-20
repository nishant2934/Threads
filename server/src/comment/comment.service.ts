import { Injectable } from '@nestjs/common';
import { ResponseService } from 'src/global-provider/responses.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { commentOnThreadDto } from './dto/commentOnThread.dto';
import { commentOnCommentDto } from './dto/commentOnComment.dto';
import { deleteCommentDto } from './dto/deleteComment.dto';
import { CommentModel } from 'src/constants';

@Injectable()
export class CommentService {
    constructor(private prisma: PrismaService, private response: ResponseService) { }

    async getCommentsWithPagination(skip: string, take: string, search: string, order_by: string, order: string) {
        try {
            let filter_object = {};
            if (search && search.length) {
                filter_object["where"] = {
                    OR: [{ content: { contains: search } }]
                }
            }
            if (order_by && order_by.length) {
                filter_object["orderBy"] = {
                    [`${order_by}`]: order === "desc" ? "desc" : "asc"
                }
            }
            let comments_count = await this.prisma.comment.findMany(filter_object);
            filter_object = { ...filter_object, skip: skip ? parseInt(skip) : 0, take: take ? parseInt(take) : 10, select: CommentModel }
            let comments = await this.prisma.comment.findMany(filter_object);
            return this.response.success('Fetched comments successfully', { records: comments, total_records: comments_count.length });
        } catch (error) {
            console.log(error);
            return this.response.systemError(error);
        }
    }

    async getComment(id: string) {
        try {
            let comment = await this.prisma.comment.findFirst({ where: { id }, select: CommentModel });
            if (!comment) {
                return this.response.error('Sorry, No such comment found');
            }
            return this.response.success('Comment found successfully', comment);
        } catch (error) {
            console.log(error);
            return this.response.systemError(error);
        }
    }

    async commentOnThread(comment: commentOnThreadDto) {
        try {
            let thread = await this.prisma.thread.findFirst({ where: { id: comment.thread_id } });
            if (!thread) {
                return this.response.error("Sorry, No such thread found.");
            }
            await this.prisma.comment.create({ data: comment });
            return this.response.success("Comment made successfully.", "");
        } catch (error) {
            console.log(error);
            this.response.systemError(error);
        }
    }

    async commentOnComment(comment: commentOnCommentDto) {
        try {
            let comment_to_comment_on = await this.prisma.thread.findFirst({ where: { id: comment.comment_id } });
            if (!comment_to_comment_on) {
                return this.response.error("Sorry, No such comment found.");
            }
            await this.prisma.comment.create({ data: comment });
            return this.response.success("Comment made successfully.", "");
        } catch (error) {
            console.log(error);
            this.response.systemError(error);
        }
    }

    async deleteComments(comment: deleteCommentDto) {
        try {
            let comment_to_delete = await this.prisma.comment.findFirst({ where: { id: comment.comment_id, user_id: comment.user_id } });
            if (!comment_to_delete) {
                return this.response.error("Sorry, No such comment found.");
            }
            await this.deleteComment(comment_to_delete.id);
            return this.response.success("Comment deleted successfully.", "");
        } catch (error) {
            console.log(error);
            this.response.systemError(error);
        }
    }

    async deleteComment(id: string) {
        try {
            let comments_on_comment = await this.prisma.comment.findMany({ where: { comment_id: id } });
            if (comments_on_comment.length) {
                for (let comment of comments_on_comment) {
                    await this.deleteComment(comment.id);
                }
                await this.prisma.comment.deleteMany({ where: { comment_id: id } })
                return
            }
            return
        } catch (error) {
            console.log(error);
        }
    }

    async likeComment(comment_id: string, user_id: string) {
        try {
            let comment = await this.prisma.comment.findFirst({ where: { id: comment_id } });
            if (!comment) {
                return this.response.error('Sorry, no such comment found.');
            }
            let liked_comment = await this.prisma.likedComment.findFirst({ where: { comment_id, user_id } });
            if (liked_comment) {
                return this.response.error('Sorry, like already exist.');
            }
            let deleted = await this.prisma.dislikedComment.deleteMany({ where: { comment_id, user_id } })
            await this.prisma.comment.update({ where: { id: comment.id }, data: { likes: comment.likes + 1, dislikes: deleted?.count ? comment.dislikes - 1 : comment.dislikes } })
            await this.prisma.likedComment.create({ data: { comment_id, user_id } })
            return this.response.success('Comment liked successfully.', "");
        } catch (error) {
            console.log(error);
            return this.response.systemError(error);
        }
    }

    async dislikeComment(comment_id: string, user_id: string) {
        try {
            let comment = await this.prisma.comment.findFirst({ where: { id: comment_id } });
            if (!comment) {
                return this.response.error('Sorry, no such comment found.');
            }
            let disliked_comment = await this.prisma.dislikedComment.findFirst({ where: { comment_id, user_id } });
            if (disliked_comment) {
                return this.response.error('Sorry, dislike already exist.');
            }
            let deleted = await this.prisma.likedComment.deleteMany({ where: { comment_id, user_id } });
            await this.prisma.comment.update({ where: { id: comment.id }, data: { dislikes: comment.dislikes + 1, likes: deleted?.count ? comment.likes - 1 : comment.likes } })
            await this.prisma.dislikedComment.create({ data: { comment_id, user_id } })
            return this.response.success('Comment disliked successfully.', "");
        } catch (error) {
            console.log(error);
            return this.response.systemError(error);
        }
    }
}
