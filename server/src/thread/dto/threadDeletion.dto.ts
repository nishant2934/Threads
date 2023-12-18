import { IsNotEmpty } from 'class-validator';

export class threadDeletionDto {
    @IsNotEmpty()
    user_id: string;

    @IsNotEmpty()
    thread_id: string;
}