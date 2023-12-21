import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class RoleGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        let { user_id } = request.body;
        if (!user_id) {
            throw new UnauthorizedException({message:"hello"});
        }
        else {
            return true;
        }
    }
}