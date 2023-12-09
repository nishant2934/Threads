import { Injectable } from "@nestjs/common";
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {

    async hash(data: string) {
        return await bcrypt.hash(data, 16)
    }

    compare(data: string, hash: string) {
        return bcrypt.compare(data, hash);
    }
}
