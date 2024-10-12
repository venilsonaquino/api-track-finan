import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { FileEntity } from './entities/file.entity';
import { FilesFactory } from './files.factory';

@Injectable()
export class FilesService {
  async uploadFile(file: Express.Multer.File) {

    const fileEntity = new FileEntity({
      fileName: file.originalname
    });
    const fileType = fileEntity.getFileType();

    const processingStrategy = FilesFactory.getStrategy(fileType);
    const bankTransfer = processingStrategy.parse(file);

    return bankTransfer
  }
}
