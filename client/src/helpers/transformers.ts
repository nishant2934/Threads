export const catchApiResponse = (res:any):string =>{
    let message  = res?.response?.data?.message;
    if(!message){
      message = "Something unexpected happened."
    }
    else if(message && typeof message === "object"){
      message = message[0]
    }
    return message
}