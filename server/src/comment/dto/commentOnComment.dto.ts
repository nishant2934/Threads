import { IsNotEmpty } from 'class-validator';

export class commentOnCommentDto {
    @IsNotEmpty()
    comment_id: string;

    @IsNotEmpty()
    user_id: string;

    @IsNotEmpty()
    content:string
}