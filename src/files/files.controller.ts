import { 
  Controller, 
  Post, 
  UseInterceptors, 
  UploadedFile, 
  ParseFilePipe, 
  MaxFileSizeValidator, 
  FileTypeValidator, 
  UseGuards 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { FileDto } from './dto/file.dto';

@UseGuards(AuthGuard)
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 50 * 1024 }), //50KB
          new FileTypeValidator({ fileType: 'pdf|octet-stream' }),
        ]
      })
    ) 
    file: Express.Multer.File,
  ): Promise<FileDto[]> {
    const bankTransfer = await this.filesService.uploadFile(file);
    return bankTransfer
  }
}