import { Body, Controller, HttpStatus, Post, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AnyFilesInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './uploads.service';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('uploads')
export class UploadsController {
    constructor(private upload:UploadsService) { }

    @Post('file')
    @UseInterceptors(FilesInterceptor('files'))
    uploadFiles(@Req() req:any) {
        return this.upload.uploadFiles(req.files)
    }
}
