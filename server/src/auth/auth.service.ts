import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as moment from 'moment';
import { loginDto } from 'src/auth/dto/login.dto';
import { registerDto } from 'src/auth/dto/register.dto';
import { EncryptionService } from 'src/global-provider/encryption.service';
import { HashService } from 'src/global-provider/hash.service';
import { ResponseService } from 'src/global-provider/responses.service';
import { TransformerService } from 'src/global-provider/transformer.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { GatewayService } from 'src/gateway/gateway.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private response: ResponseService,
        private hash: HashService,
        private encrypt: EncryptionService,
        private transformer:TransformerService,
        private jwt:JwtService,
        private readonly gateway: GatewayService,
    ) { }

    async checker() {
        // const thread = await this.prisma.comment.findFirst({where:{id: "6577301ac04772b8178d0e16"},include:{comments:{include:{comments:{include:{comments:{include:{comments:true}}}}}}}})
        this.gateway.server.emit("cnt", "this is from cnt")
        return this.response.success("made comment.","")
    }

    async validate(user_id: string) {
        try {
            const user = await this.prisma.user.findFirst({ where: { id: user_id }, select: { name: true, user_name: true, email: true, id: true } })
            if(user){
                return this.response.success("Token validated successfully.", user)
            }
            return this.response.error("Token validation failed.")
        } catch (error) {
            console.log(error)
            return this.response.systemError(error)
        }
    }

    async register(registerDto: registerDto) {
        try {
            registerDto.password = await this.hash.hash(registerDto.password);
            const user = await this.prisma.user.create({ data: registerDto, select:{name:true,user_name:true,email:true,id:true} });
            const token = await this.jwt.signAsync({id:user.id});
            return this.response.success("Registration successful.", {...user,token})
        } catch (error) {
            console.log(error)
            return this.response.systemError(error)
        }
    }

    async login(loginDto: loginDto) {
        try {
            const { email, password } = loginDto;
            const user = await this.prisma.user.findFirst({ where: { email }, select:{password:true,name:true,user_name:true,email:true,id:true}})
            if (user && await this.hash.compare(password, user.password)) {
                this.transformer.deleteObjKeys(["password"],user,true);
                const token = await this.jwt.signAsync({id:user.id});
                return this.response.success("Login Successful.", {...user,token})
            }
            return this.response.error("Credentials does not match.")
        } catch (error) {
            console.log(error)
            return this.response.systemError(error)
        }
    }

    async sendOtpToVerifyEmail(id:string) {
        try {
            if(!id){
                return this.response.error("Id is required.") 
            }
            const user = await this.prisma.user.findFirst({where:{id}});
            if(!user){
                return this.response.error("No such id is registered with us.")
            }
            if(user.email_verified){
                return this.response.error("Email is already verified.")
            }
            const otp = this.encrypt.randomNumber(6);
            const otp_created_at = moment().toDate();
            const updated_user = await this.prisma.user.update({where:{id},data:{otp,otp_created_at}, select:{name:true,user_name:true,email:true}});
            return this.response.success("Otp sent successfully, it will be valid for a day.",updated_user);
        } catch (error) {
            console.log(error);
            return this.response.systemError(error)
        }
    }

    async verifyEmailWithOtp( otp:number, id:string) {
        try {
            if(!id || !otp){
                return this.response.error("Id and otp required.") 
            }
            const user = await this.prisma.user.findUnique({where:{id}});
            if(!user){
                return this.response.error("No such id is registered with us.")
            }
            if(!user.otp || moment().isAfter(moment(user.otp_created_at).add(1,"d"))){
                return this.response.error("No otp or otp expired.")
            }
            if(user.otp !== otp){
                return this.response.error("Invalid otp provided.")
            }
            const updated_user = await this.prisma.user.update({where:{id:user.id},data:{email_verified:true,otp:null,otp_created_at:null}})
            return this.response.success("Password changed Successfully.",updated_user);
        } catch (error) {
            console.log(error);
            return this.response.systemError(error)
        }
    }

    async forgotPassword(email:string) {
        try {
            if(!email){
                return this.response.error("Email is required.") 
            }
            const user = await this.prisma.user.findUnique({where:{email}});
            if(!user){
                return this.response.error("No such email is registered with us.")
            }
            if(!user.email_verified){
                return this.response.error("Sorry, but your email is not verified.")
            }
            const otp = this.encrypt.randomNumber(6);
            const otp_created_at = moment().toDate();
            const updated_user = await this.prisma.user.update({where:{email},data:{otp,otp_created_at}, select:{name:true,user_name:true,email:true}});
            return this.response.success("Otp sent successfully, it will be valid for a day.",updated_user);
        } catch (error) {
            console.log(error);
            return this.response.systemError(error)
        }
    }

    async verifyOtpAndResetPassword( otp:number, id:string, password:string,) {
        try {
            if(!id || !password || !otp){
                return this.response.error("Id, Password and otp required.") 
            }
            const user = await this.prisma.user.findFirst({where:{id}});
            if(!user){
                return this.response.error("No such id is registered with us.")
            }
            if(!user.otp || moment().isAfter(moment(user.otp_created_at).add(1,"d"))){
                return this.response.error("No otp or otp expired.")
            }
            if(user.otp !== otp){
                return this.response.error("Invalid otp provided.")
            }
            password = await this.hash.hash(password);
            const updated_user = await this.prisma.user.update({where:{id:user.id},data:{password,otp:null,otp_created_at:null}})
            return this.response.success("Password changed Successfully.",updated_user);
        } catch (error) {
            console.log(error);
            return this.response.systemError(error)
        }
    }
}
