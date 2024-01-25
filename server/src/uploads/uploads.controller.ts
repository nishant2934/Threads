import { Body, Controller, Get, HttpException, HttpStatus, Post, Query, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AnyFilesInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './uploads.service';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ResponseService } from 'src/global-provider/responses.service';
import * as fs from 'fs';

@Controller('uploads')
export class UploadsController {
    constructor(private upload:UploadsService, private response:ResponseService) { }

    // multiple files upload
    @Post('file')
    @UseInterceptors(FilesInterceptor('files', 10, {
        storage: diskStorage({
            destination: './public',
            filename: (req, file, cb) => {
                // Example: Reject files with a specific extension
                if (file.originalname.endsWith('.exe')) {
                    return cb(new HttpException('File with .exe extension is not allowed',500), null);
                }
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                cb(null, `${randomName}${extname(file.originalname)}`);
            },
        }),
    }))
    uploadFiles(@Req() req: any) {
        return this.upload.uploadFiles(req.files)
    }

    // simulating frontend code
    @Post('driver')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: "./public",
            filename: (req, file, cb) => {
                let {fl_name} = req.query;
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                cb(null, `${randomName}${extname(file.originalname)}`);
            },
        }),
    }))
    driver(@Req() req: any){
        return this.upload.driver(req.file)
    }


    //Single file chunk upload
    @Post('chunk')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: (req, file, cb) => {
                let {fd_name} = req.query;
                const directoryPath = `./public/${fd_name}`;
                if (!fs.existsSync(directoryPath)) {
                    fs.mkdirSync(directoryPath, { recursive: true });
                }
                cb(null, directoryPath);    
            },
            filename: (req, file, cb) => {
                let {fl_name} = req.query;
                cb(null, `${fl_name}`);
            },
        }),
    }))
    uploadSingleFile(@Req() req: any) {
        return this.upload.uploadSingleFile(req.file)
    }

    //
    @Get("process-chunks")
    processChunks(@Query() query : { fd_name:string,fl_name:string,chunks:string }){
        let {fd_name,fl_name,chunks} = query;
        return this.upload.processChunks(fd_name,fl_name,parseInt(chunks))
    }
}

