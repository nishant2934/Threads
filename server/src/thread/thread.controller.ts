import { Body, Controller, Get, Post, UsePipes, ValidationPipe,Query } from '@nestjs/common';
import { ThreadService } from './thread.service';

@Controller('thread')
export class ThreadController {
    constructor(private readonly thread: ThreadService) { }

    @Get("")
    test(){
        return this.thread.test();
    }

    @Post("create")
    create(){
        return this.thread.create()
    }
}
