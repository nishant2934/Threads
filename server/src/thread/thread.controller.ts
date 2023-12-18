import { Body, Controller, Get, Post, UsePipes, ValidationPipe,Query, Request} from '@nestjs/common';
import { ThreadService } from './thread.service';
import { threadCreationDto } from './dto/threadCreation.dto';
import { threadDeletionDto } from './dto/threadDeletion.dto';
import { threadEditionDto } from './dto/threadEdition.dto';

@Controller('thread')
export class ThreadController {
    constructor(private readonly thread: ThreadService) { }
    @Get("")
    test(@Body() body:{user_id:string}){
        return this.thread.test(body);
    }

    @Post("create")
    @UsePipes(new ValidationPipe({transform:true}))
    create(@Body() thread: threadCreationDto){
        return this.thread.create(thread)
    }

    @Post("delete")
    @UsePipes(new ValidationPipe({transform:true}))
    delete(@Body() thread: threadDeletionDto){
        return this.thread.delete(thread)
    }

    @Post("edit")
    @UsePipes(new ValidationPipe({transform:true,whitelist:true}))
    edit(@Body() thread: threadEditionDto){
        console.log(thread);
        return 
    }
}
