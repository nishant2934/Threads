import { IsNotEmpty } from 'class-validator';

export class threadCreationDto {
    @IsNotEmpty()
    user_id: string;

    @IsNotEmpty()
    heading: string;

    @IsNotEmpty()
    content:string
}