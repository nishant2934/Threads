import { Body, Controller, Get, Post, UsePipes, ValidationPipe,Query, Request, Param, ParseIntPipe} from '@nestjs/common';
import { ThreadService } from './thread.service';
import { threadCreationDto } from './dto/threadCreation.dto';
import { threadDeletionDto } from './dto/threadDeletion.dto';
import { threadEditionDto } from './dto/threadEdition.dto';

@Controller('thread')
export class ThreadController {
    constructor(private readonly thread: ThreadService) { }

    @Get("")
    getThreadsWithPagination(@Query() filters: any){
        let { skip, take, search, order_by, order } = filters;
        return this.thread.getThreadsWithPagination(skip,take,search,order_by,order);
    }

    @Get(":id")
    getThread(@Param() params: any){
        return this.thread.getThread(params.id);
    }

    @Get("like/:id")
    likeThread(@Param() params: any, @Body('user_id') user_id: string) {
        return this.thread.likeThread(params.id, user_id);
    }

    
    @Get("dislike/:id")
    dislikeThread(@Param() params: any, @Body('user_id') user_id: string) {
        return this.thread.dislikeThread(params.id, user_id);
    }

    @Post("create")
    @UsePipes(new ValidationPipe({transform:true,whitelist:true}))
    create(@Body() thread: threadCreationDto){
        return this.thread.create(thread)
    }

    @Post("delete")
    @UsePipes(new ValidationPipe({transform:true,whitelist:true}))
    delete(@Body() thread: threadDeletionDto){
        return this.thread.delete(thread)
    }

    @Post("edit")
    @UsePipes(new ValidationPipe({transform:true,whitelist:true}))
    edit(@Body() thread: threadEditionDto){
        return this.thread.edit(thread)
    }
}
