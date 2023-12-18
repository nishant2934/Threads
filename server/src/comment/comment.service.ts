import { Injectable } from '@nestjs/common';
import { ResponseService } from 'src/global-provider/responses.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { commentOnThreadDto } from './dto/commentOnThread.dto';
import { commentOnCommentDto } from './dto/commentOnComment.dto';
import { deleteCommentDto } from './dto/deleteComment.dto';

@Injectable()
export class CommentService {
    constructor(private prisma: PrismaService, private response: ResponseService) { }

    async commentOnThread(comment:commentOnThreadDto){
        try {
            let thread = await this.prisma.thread.findFirst({where:{id:comment.thread_id}});
            if(!thread){
                return this.response.error("Sorry, No such thread found.");
            }
            await this.prisma.comment.create({data:comment});
            return this.response.success("Comment made successfully.","");
        } catch (error) {
            console.log(error);
            this.response.systemError(error);
        }
    }

    async commentOnComment(comment:commentOnCommentDto){
        try {
            let comment_to_comment_on = await this.prisma.thread.findFirst({where:{id:comment.comment_id}});
            if(!comment_to_comment_on){
                return this.response.error("Sorry, No such comment found.");
            }
            await this.prisma.comment.create({data:comment});
            return this.response.success("Comment made successfully.","");
        } catch (error) {
            console.log(error);
            this.response.systemError(error);
        }
    }

    async deleteComments(comment:deleteCommentDto){
        try {
            let comment_to_delete = await this.prisma.comment.findFirst({where:{id:comment.comment_id,user_id:comment.user_id}});
            if(!comment_to_delete){
                return this.response.error("Sorry, No such comment found.");
            }
            await this.deleteComment(comment_to_delete.id);
            return this.response.success("Comment deleted successfully.","");
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

}
