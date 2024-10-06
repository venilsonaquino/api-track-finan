import { Controller, Post, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, UseGuards } from '@nestjs/common';
import { FileInterceptor, NoFilesInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { PayloadResponse } from 'src/auth/dto/login-response.dto';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { UserEntity } from 'src/users/entities/user.entity';
import { TransactionsService } from 'src/transactions/transactions.service';

@UseGuards(AuthGuard)
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly transactionsService: TransactionsService
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @CurrentUser() user: UserEntity,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 50 * 1024 }), //50KB
          new FileTypeValidator({ fileType: 'pdf|octet-stream' }),
        ]
      })
    ) 
    file: Express.Multer.File,
  ) {
    
    const bankTransfer = await this.filesService.uploadFile(file);

    await this.filesService.create(file, user.id);
    await this.transactionsService.createMany(bankTransfer, user.id);
    
    return {
      "status": "success",
      "message": "Batch operation completed successfully.",
      "data": bankTransfer
    }
  }
}