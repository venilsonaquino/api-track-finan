import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { FileEntity } from './entities/file.entity';
import { FilesFactory } from './files.factory';
import { FileModel } from './models/file.model';
import { InjectModel } from '@nestjs/sequelize';
import { TransactionsService } from 'src/transactions/transactions.service';
import { Sequelize } from 'sequelize-typescript';
import { CreateTransactionDto } from 'src/transactions/dto/create-transaction.dto';

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
