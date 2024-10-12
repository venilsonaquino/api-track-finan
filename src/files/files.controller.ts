import { 
  Controller, 
  Post, 
  UseInterceptors, 
  UploadedFile, 
  ParseFilePipe, 
  MaxFileSizeValidator, 
  FileTypeValidator, 
  UseGuards, 
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { CreateTransactionDto } from 'src/transactions/dto/create-transaction.dto';
import { FileDto } from './dto/file.dto';

@UseGuards(AuthGuard)
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
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
    const transaction = await this.filesService.uploadFile(file);
    return transaction
  }
}