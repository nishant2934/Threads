import { Body, Controller, Get, Param, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { CommentService } from './comment.service';
import { commentOnThreadDto } from './dto/commentOnThread.dto';
import { commentOnCommentDto } from './dto/commentOnComment.dto';

@Controller('comment')
export class CommentController {
    constructor(private readonly comment: CommentService) { }

    @Get("")
    getThreadsWithPagination(@Query() filters: any, @Body("user_id") user_id: string) {
        let { skip, take, search, order_by, order } = filters;
        return this.comment.getCommentsWithPagination(skip, take, search, order_by, order, user_id);
    }

    @Get(":id")
    getComment(@Param() params: any) {
        return this.comment.getComment(params.id);
    }

    @Get("like/:id")
    likeComment(@Param() params: any, @Body('user_id') user_id: string) {
        return this.comment.likeComment(params.id, user_id);
    }

    @Get("dislike/:id")
    dislikeComment(@Param() params: any, @Body('user_id') user_id: string) {
        return this.comment.dislikeComment(params.id, user_id);
    }

    @Post("create-on-thread")
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    commentOnThread(@Body() comment: commentOnThreadDto) {
        return this.comment.commentOnThread(comment);
    }

    @Post("create-on-comment")
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    create(@Body() comment: commentOnCommentDto) {
        return this.comment.commentOnComment(comment);
    }

}
