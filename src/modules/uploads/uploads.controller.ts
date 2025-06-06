import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './uploads.service';
import { ApiTags, ApiConsumes, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { Public, Roles } from '../auth/guards';

@ApiTags('uploads')
@ApiBearerAuth()
@Controller('uploads')
export class UploadsController {
    constructor(private readonly fileService: UploadsService) {}

    @Post('uploads')
    @Roles('ADMIN', 'SUPER_ADMIN')
    @UseInterceptors(FileInterceptor('uploads'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                uploads: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    async uploadFile(
        @UploadedFile() file: Express.Multer.File
    ): Promise<{ data: { url: string } }> {
        return this.fileService.saveFile(file);
    }
}
