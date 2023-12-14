import { Injectable } from '@nestjs/common';
import { EncryptionService } from 'src/global-provider/encryption.service';
import { ResponseService } from 'src/global-provider/responses.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { threadCreationDto } from './dto/threadCreation.dto';

@Injectable()
export class ThreadService {
    constructor(private prisma: PrismaService, private response: ResponseService, private encryption: EncryptionService) { }

    test(body: { user_id: string }) {
        console.log(body.user_id, "printing from here")
        return
    }

    async create(thread: threadCreationDto) {
        try {
            const new_thread = await this.prisma.thread.create({data:thread})
            return this.response.success("Thread created successfully", new_thread)
        } catch (error) {
            console.log(error)
            return this.response.systemError(error)
        }
    }
}
