import { IsNotEmpty, IsOptional } from 'class-validator';

export class threadEditionDto {
    @IsNotEmpty()
    user_id: string;

    @IsNotEmpty()
    thread_id: string;

    @IsOptional()
    heading:string;

    @IsOptional()
    content:string;
}