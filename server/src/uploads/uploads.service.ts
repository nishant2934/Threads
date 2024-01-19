import {Injectable } from '@nestjs/common';
import { ResponseService } from 'src/global-provider/responses.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UploadsService {
    constructor(private prisma: PrismaService, private response: ResponseService) { }

    uploadFiles(files: Array<Express.Multer.File>) {
        console.log(files)
    }
}
