import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as moment from 'moment';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GatewayGuard implements CanActivate {
    constructor(private readonly prisma: PrismaService, private jwt: JwtService) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            if (context.getType() !== "ws") {
                return true;
            }
            const client = context.switchToWs().getClient();
            let { authorization } = client.handshake.headers;
            if (!authorization) {
                return false
            }
            const token = authorization.split(" ")[1]
            const { id, iat, exp } = await this.jwt.verifyAsync(token);
            let current = moment().unix();
            if (current > exp) {
                return false;
            }
            const user = await this.prisma.user.findFirst({ where: { id } });
            if (!user) {
                return false;
            }
            return true
        } catch (error) {
            console.log(error);
            return false
        }
    }
}