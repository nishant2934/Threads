import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import * as moment from 'moment';
import { ResponseService } from 'src/global-provider/responses.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtMiddleWare implements NestMiddleware {
    constructor(private readonly prisma: PrismaService, private response: ResponseService, private jwt: JwtService) { }
    async use(req: Request, res: Response, next: NextFunction) {
        try {
            let authorization = req?.headers?.authorization;
            if (!authorization) {
                return res.json(this.response.error("Please provide bearer token."))
            }
            const token = authorization.split(" ")[1]
            const { id, iat, exp } = await this.jwt.verifyAsync(token);
            let current = moment().unix();
            if(current > exp){
                return res.json(this.response.error("Token expired."))
            }
            const user = await this.prisma.user.findFirst({where:{id}});
            if(!user){
                return res.json(this.response.error("Invalid token."))
            }
            if((exp - current) < 3600){
                //if token is about to be expired in the next hour 
                //here will be making a socket call to frontend to refresh  the saved token
            }
            next()
        } catch (error) {
            return res.json(this.response.systemError(error))
        }
    }

}