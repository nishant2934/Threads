import { Body, Controller, Get, Post, UsePipes, ValidationPipe,Query, Request} from '@nestjs/common';
import { ThreadService } from './thread.service';

@Controller('thread')
export class ThreadController {
    constructor(private readonly thread: ThreadService) { }
    @Get("")
    test(@Request() req:any){
        console.log(req.user_id)
        return this.thread.test();
    }

    @Post("create")
    create(){
        return this.thread.create()
    }
}
