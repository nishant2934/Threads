import {Injectable } from '@nestjs/common';
import { ResponseService } from 'src/global-provider/responses.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { HttpService } from "@nestjs/axios";
import * as path from 'path';
import * as fs from 'fs';
import {lastValueFrom } from 'rxjs';
import * as moment from 'moment';

@Injectable()
export class UploadsService {
    constructor(private prisma: PrismaService, private response: ResponseService, private httpService: HttpService) { }

    uploadFiles(files: Array<Express.Multer.File>) {
        for(let file of files){
            console.log(file)
        }
    }

    uploadSingleFile(file : Express.Multer.File) {
        try {
            if(file){
                return this.response.success("File Saved","");
            }
            else{
                return this.response.error("Some error occurred while saving file")
            }
        } catch (error) {
            return this.response.systemError(error);
        }
    }

    processChunks(folder_name: string, file_name: string, chunks: number) {
        try {
            let cnt = 0;
            let blob_paths = [];
            let chunk_size = 1024 * 1024;
            let f_path = ""
            let output_path =  path.join(__dirname, "../..", 'public', file_name)
            while (cnt < chunks) {
                f_path = path.join(__dirname, "../..", 'public', folder_name, `${file_name}__${cnt * chunk_size}__${(cnt + 1) * chunk_size}`);
                blob_paths.push(f_path)
                cnt = cnt + 1
            }
            const combined_data_buffer = blob_paths.map(path => fs.readFileSync(path));
            fs.writeFileSync(output_path, Buffer.concat(combined_data_buffer))
            return this.response.success("File processed successfully","");
        } catch (error) {
            return this.response.systemError(error)
        }
    }

    async driver(file: Express.Multer.File) {
        try {
            const headers = {
                Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1OWUzOGI1MGNkYWU0Zjg0ZjY4ZTAwYyIsImlhdCI6MTcwNjE1NTA3MCwiZXhwIjoxNzA2MjQxNDcwfQ.nTvEMcrZt9-EQNyUGOFVEoWaTznSHZT2oZbEoVG9plY"
            };

            const uploadChunk = async (chunk:Blob,fl_name:string,fd_name:string,start:number,end:number) => {
                try {
                    let formData = new FormData();
                    formData.append('file',chunk)
                    let { data } = await lastValueFrom(this.httpService.post(`http://localhost:9000/uploads/chunk?fl_name=${fl_name}&fd_name=${fd_name}`,formData, { headers} ))
                    if(!data.error){
                        return true
                    }
                    return {start,end}
                } catch (error) {
                    return {start,end}
                }
            }

            const processChunk = async (file_name:string,folder_name:string,chunks:number) => {
                try {
                    let {data} = await lastValueFrom(this.httpService.get(`http://localhost:9000/uploads/process-chunks?fl_name=${file_name}&fd_name=${folder_name}&chunks=${chunks}`, { headers }))
                    return !data.error
                } catch (error) {
                    return false
                }
            }

            const saved_file = fs.readFileSync(path.join(__dirname, "../..", 'public', file.filename));
            let folder_name = `${moment().unix()}__${"user_id"}__${file.filename}`
            let file_name = `${"user_id"}__${file.filename}`


            let start = 0;
            let chunk_size = 1024 * 1024;
            let requests = []

            while (start < saved_file.length) {
                let chunk = saved_file.subarray(start, start + chunk_size)
                let chunk_blob = new Blob([chunk]);
                requests.push(uploadChunk(chunk_blob, `${file_name}__${start}__${start + chunk_size}`, folder_name, start, start + chunk_size))
                start = start + chunk_size
            }
            requests = await Promise.all(requests)
            let processing_result = processChunk(file_name,folder_name,requests.length)
            if(processing_result){
                return this.response.success("File uploaded successfully.","")
            }
            return this.response.error("File processing failed");
        } catch (error) {
            return this.response.error(error)
        }
    }
}
