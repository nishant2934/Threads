import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import * as moment from 'moment';
import { EncryptionService } from 'src/global-provider/encryption.service';
import { ResponseService } from 'src/global-provider/responses.service';
import { PrismaService } from 'src/prisma/prisma.service';


// interface ExtendedRequest extends Request {
//     user_id?: string;
// }

@Injectable()
export class JwtMiddleWare implements NestMiddleware {
    constructor(private readonly prisma: PrismaService, private response: ResponseService, private jwt: JwtService,private encryption:EncryptionService) { }
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
            // if token is about to be expired in the next hour
            // here will be making a socket call to frontend to refresh the saved token
            if((exp - current) < 3600){}

            // here in future when connecting to frontend the the request body coming will be in encrypted format {encoded_data:"encoded_string"}
            // the body will be changed to {... decrypted data}

            // adding user_id in req.body because other will have to add to the request and accessing that will be problematic in services, if still want 
            //to do use above interface ExtendedRequest.
            req.body = {...req.body, user_id:id};
            next()
        } catch (error) {
            return res.json(this.response.systemError(error))
        }
    }

}