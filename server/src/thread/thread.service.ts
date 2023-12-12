import { Injectable } from '@nestjs/common';
import { HashService } from 'src/global-provider/hash.service';
import { ResponseService } from 'src/global-provider/responses.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ThreadService {
    constructor(prisma:PrismaService,response:ResponseService){}

    test(){
        return "this is test";
    }

    create(){
        return "jd"
    }
}
