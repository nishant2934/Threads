import { Injectable } from "@nestjs/common";

@Injectable()
export class TransforerService {

    renameObjKeys(keys_to_rename:string[],new_names:string[],obj:any, in_place:boolean = false) {
        let new_obj = in_place ? obj : structuredClone(obj);

        keys_to_rename.forEach((key,index)=>{
            if(obj.hasOwnProperty(key)){
                new_obj[new_names[index]] = obj[key];
                delete new_obj[key]
            }
        })

        return new_obj
    }

    deleteObjKeys(keys_to_delete:string[],obj:any, in_place:boolean = false) {
        let new_obj = in_place ? obj : structuredClone(obj);

        keys_to_delete.forEach((key,index)=>{
            if(new_obj.hasOwnProperty(key)){
                delete new_obj[key]
            }
        })
        
        return new_obj
    }

}
