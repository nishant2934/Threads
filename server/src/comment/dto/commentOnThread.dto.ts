import { IsNotEmpty } from 'class-validator';

export class commentOnThreadDto {
    @IsNotEmpty()
    thread_id: string;

    @IsNotEmpty()
    user_id: string;

    @IsNotEmpty()
    content:string
}