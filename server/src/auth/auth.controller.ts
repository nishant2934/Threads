import { Body, Controller, Get, Post, UsePipes, ValidationPipe,Query } from '@nestjs/common';
import { loginDto } from 'src/dto/login.dto';
import { registerDto } from 'src/dto/register.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly auth: AuthService) { }

    @Get()
    checker(){
        return this.auth.checker();
    }

    @Post("register")
    @UsePipes(new ValidationPipe({ transform: true }))
    register(@Body() registerDto : registerDto) {
        return this.auth.register(registerDto)
    }

    @Post("login")
    @UsePipes(new ValidationPipe({ transform: true }))
    login(@Body() loginDto : loginDto) {
        return this.auth.login(loginDto);
    }

    @Get("send-otp-to-verify-email")
    sendOtpToVerifyEmail(@Query('id') id:string) {
        return this.auth.sendOtpToVerifyEmail(id);
    }

    @Post("verify-email-with-otp")
    verifyEmailWithOtp(@Body() body: { id: string; otp: number }) {
        let {id,otp} = body;
        return this.auth.verifyEmailWithOtp(otp,id);
    }
}
