import { Injectable } from '@nestjs/common';
import { FileEntity } from './entities/file.entity';
import { FilesFactory } from './files.factory';
import { FileModel } from './models/file.model';
import { InjectModel } from '@nestjs/sequelize';
import { TransactionsService } from 'src/transactions/transactions.service';
import { BankTransferType } from 'src/common/types/bank-transfer.type';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class FilesService {
  constructor(
    @InjectModel(FileModel)
    private readonly fileModel: typeof FileModel,
    private readonly transactionsService: TransactionsService,
    private sequelize: Sequelize
  ) {}

  async create(file: Express.Multer.File, userId: string, bankTransfer: BankTransferType[]) {
    await this.sequelize.transaction();
    const fileEntity = new FileEntity({
      fileName: file.originalname,
      userId: userId
    });

    const createdFile = await this.fileModel.create(fileEntity);
    await this.transactionsService.createMany(bankTransfer, userId, createdFile.id);
  }

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
