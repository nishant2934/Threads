import { IsNotEmpty } from 'class-validator';

export class deleteCommentDto {
    @IsNotEmpty()
    comment_id: string;

    @IsNotEmpty()
    user_id: string;
}