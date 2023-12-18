import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CommentService } from './comment.service';
import { commentOnThreadDto } from './dto/commentOnThread.dto';
import { commentOnCommentDto } from './dto/commentOnComment.dto';

@Controller('comment')
export class CommentController {
    constructor(private readonly comment: CommentService) { }

    @Post("create-on-thread")
    @UsePipes(new ValidationPipe({transform:true,whitelist:true}))
    commentOnThread(@Body() comment:commentOnThreadDto){
        return this.comment.commentOnThread(comment);
    }

    @Post("create-on-comment")
    @UsePipes(new ValidationPipe({transform:true,whitelist:true}))
    create(@Body() comment:commentOnCommentDto){
        return this.comment.commentOnComment(comment);
    }
}
