import { Injectable } from '@nestjs/common';
import { FileEntity } from './entities/file.entity';
import { FilesFactory } from './files.factory';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class FilesService {
  async uploadFile(file: Express.Multer.File) {

    const fileEntity = new FileEntity(file);
    const fileType = fileEntity.getFileType();

    const processingStrategy = FilesFactory.getStrategy(fileType);
    const bankTransfer = processingStrategy.parse(file);

    return bankTransfer
  }
}
