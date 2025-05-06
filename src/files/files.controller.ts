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
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { PayloadResponse } from 'src/auth/dto/login-response.dto';

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
    @CurrentUser() user: PayloadResponse
  ): Promise<FileDto[]> {
    const userId = user.id

    const transactions = this.filesService.extractTransactionsFromFile(file);
    const processedTransactions = await this.filesService.processTransactions(transactions, userId);
    return processedTransactions
  }
}