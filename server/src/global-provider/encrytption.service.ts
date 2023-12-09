import { Injectable } from "@nestjs/common";
import { createCipheriv, randomBytes, createDecipheriv, scrypt } from 'crypto';
import { promisify } from 'util';
import { env } from "process";

@Injectable()
export class EncryptionService {
    private key: Buffer;
    private iv: Buffer;
    constructor() {this.setup()}

    private async setup() {
        this.iv = randomBytes(16);
        this.key = await promisify(scrypt)(env.ENCRYPTION_KEY, 'salt', 32) as Buffer;
    }

    encrypt(data: string) {
        const cipher = createCipheriv('aes-256-ctr', this.key, this.iv);
        return Buffer.concat([cipher.update(data, 'utf-8'), cipher.final()]);
    }

    decrypt(data: Buffer) {
        const decipher = createDecipheriv('aes-256-ctr', this.key, this.iv);
        const deciphered =  Buffer.concat([decipher.update(data), decipher.final()]);
        return deciphered.toString('utf-8')
    }

    randomNumber(digits: number) {
        try {
            const min = 10 ** (digits - 1);
            const max = 10 ** digits - 1;
            return Math.floor(Math.random() * (max - min + 1)) + min;
        } catch (error) {
            console.log(error)
        }
    }
}
