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

    error(msg:string,result?:any){
        return {
            message:msg,
            error:true,
            result:result ? result : ""
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