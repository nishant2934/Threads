import { Injectable } from '@nestjs/common';
import { ResponseService } from 'src/global-provider/responses.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { threadCreationDto } from './dto/threadCreation.dto';
import { threadDeletionDto } from './dto/threadDeletion.dto';
import { threadEditionDto } from './dto/threadEdition.dto';

@Injectable()
export class ThreadService {
    constructor(private prisma: PrismaService, private response: ResponseService) { }

    test(body: { user_id: string }) {
        console.log(body.user_id, "printing from here")
        return
    }

    async getThread(id:string) {
        try {
            let thread = await this.prisma.thread.findFirst({where:{id}});
            if(!thread){
                return this.response.error("Sorry, No such thread found");
            }
            return this.response.success("Thread found successfully", thread);
        } catch (error) {
            console.log(error)
            return this.response.systemError(error)
        }
    }

    async create(thread: threadCreationDto) {
        try {
            const new_thread = await this.prisma.thread.create({data:thread})
            return this.response.success("Thread created successfully.", new_thread)
        } catch (error) {
            console.log(error)
            return this.response.systemError(error)
        }
    }

    async delete(thread: threadDeletionDto) {
        try {
            let thread_to_delete = await this.prisma.thread.findFirst({where:{id:thread.thread_id,user_id:thread.user_id}})
            if(!thread_to_delete){
                return this.response.error("Sorry, no such thread found.");
            }

            let comments_to_delete = await this.prisma.comment.findMany({where:{thread_id:thread_to_delete.id}});
            for(let comment of comments_to_delete){
               await this.deleteComment(comment.id)
            }
            await this.prisma.comment.deleteMany({where:{thread_id:thread_to_delete.id}})
            await this.prisma.thread.delete({where:{id:thread_to_delete.id}});

            return this.response.success("Thread deleted successfully.","")
        } catch (error) {
            console.log(error)
            return this.response.systemError(error)
        }
    }

    async edit(thread:threadEditionDto){
        try {
            let thread_to_edit = await this.prisma.thread.findFirst({where:{id:thread.thread_id,user_id:thread.user_id}})
            if(!thread_to_edit){
                return this.response.error("Sorry, no such thread found.");
            }
            delete thread["thread_id"];
            await this.prisma.thread.update({where:{id:thread_to_edit.id},data:thread})
            return this.response.success("Thread Updated successfully.","")
        } catch (error) {
            console.log(error)
            return this.response.systemError(error)
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
