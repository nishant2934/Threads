import { Injectable, UnprocessableEntityException } from '@nestjs/common';

import {ValidationArguments, ValidatorConstraint,ValidatorConstraintInterface} from 'class-validator';
import { PrismaService } from 'src/prisma/prisma.service';

@ValidatorConstraint({ name: 'email', async: true })
@Injectable()
export class uniqueEmailvalidation implements ValidatorConstraintInterface {
    constructor(private readonly prisma: PrismaService) { }
    async validate(value: string): Promise<boolean> {
        try {
            if(!value){
                return false;
            }
            const user = await this.prisma.user.findUnique({where:{email:value}})
            return !user
        } catch (error) {
            console.log(error);
        }
    }
    defaultMessage(args: ValidationArguments) {
        return `This email is already registered.`;
    }
}

