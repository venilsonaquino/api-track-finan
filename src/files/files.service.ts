import { Injectable, InternalServerErrorException } from '@nestjs/common';
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

  async create(file: Express.Multer.File, userId: string, bankTransfer: BankTransferType[]): Promise<FileEntity> {
    
    const fileEntity = new FileEntity({
      fileName: file.originalname,
      userId: userId
    });

    const transaction = await this.sequelize.transaction();

    try {
      const createdFile = await this.fileModel.create(fileEntity, { transaction });
      await this.transactionsService.createMany(bankTransfer, userId, createdFile.id, transaction);
      await transaction.commit();
      const createdFileEntity = new FileEntity(createdFile);
      return createdFileEntity;
      
    } catch (error) {
      await transaction.rollback();
      throw new InternalServerErrorException(error.message);
    }
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
