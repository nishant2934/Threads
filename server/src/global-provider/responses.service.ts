import { Injectable} from "@nestjs/common";

@Injectable()
export class ResponseService {
    success(msg:string, result:any){
        return {
            message:msg,
            result:result,
            error:false
        }
    }

    error(msg:string){
        return {
            message:msg,
            error:true
        }
    }

    systemError(error:any){
        return{
            message:"Something unexpected happened.",
            error:true,
            errorCause:error
        }
    }
    
}