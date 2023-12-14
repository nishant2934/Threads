import { Body, Controller, Get, Post, UsePipes, ValidationPipe,Query, Request} from '@nestjs/common';
import { ThreadService } from './thread.service';
import { threadCreationDto } from './dto/threadCreation.dto';

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
}
