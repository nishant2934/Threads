import { IsNotEmpty, IsOptional } from 'class-validator';

export class threadEditionDto {
    @IsNotEmpty()
    user_id: string;

    @IsNotEmpty()
    thread_id: string;

    @IsNotEmpty()
    heading:string;

    @IsNotEmpty()
    content:string;
}