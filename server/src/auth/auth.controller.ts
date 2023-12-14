import { Body, Controller, Get, Post, UsePipes, ValidationPipe,Query } from '@nestjs/common';
import { loginDto } from 'src/auth/dto/login.dto';
import { registerDto } from 'src/auth/dto/register.dto';
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

    @Post("forgot-password")
    forgotPassword(@Body('email') email:string) {
        return this.auth.forgotPassword(email);
    }

    @Post("reset-password-with-otp")
    verifyOtpAndResetPassword(@Body() body: { otp: number,id:string, password:string }) {
        let {otp,id,password} = body;
        return this.auth.verifyOtpAndResetPassword(otp,id,password);
    }
}
