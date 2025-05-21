// src/file/file.service.ts
import {
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { join, extname } from 'path';
import { writeFile } from 'fs/promises';
import * as fs from 'fs';
import { randomUUID } from 'crypto';


@Injectable()
export class UploadsService implements OnModuleInit {
  private readonly uploadPath = join(process.cwd(), 'uploads');

  onModuleInit(): void {
    this.ensureUploadDirectoryExists();
  }

  private ensureUploadDirectoryExists(): void {
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    } else {
      console.log(`[FileService] Upload directory exists: ${this.uploadPath}`);
    }
  }

  async saveFile(file: Express.Multer.File): Promise<{ data: { url: string } }> {
    try {
      const ext = extname(file.originalname);
      const uuid = randomUUID();
      const filename = `${uuid}${ext}`;
      const filePath = join(this.uploadPath, filename);

      await writeFile(filePath, file.buffer);

      return {
        data: {
          url: `alibekmoyliyev.uz/uploads/${filename}`,
        }
      }
    } catch (error) {
      throw new InternalServerErrorException('Failed to save file');
    }
  }
}
