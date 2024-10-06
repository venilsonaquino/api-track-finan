import { Injectable } from '@nestjs/common';
import { FileEntity } from './entities/file.entity';
import { FilesFactory } from './files.factory';
import { TransactionEntity } from 'src/transactions/entities/transaction.entity';
import { STRTTRN } from 'ofx-data-extractor/dist/@types/ofx';

@Injectable()
export class FilesService {
  async uploadFile(file: Express.Multer.File, userId: string) {

    const fileEntity = new FileEntity(file);
    const fileType = fileEntity.getFileType();

    const processingStrategy = FilesFactory.getStrategy(fileType);
    const BankerTransfer = processingStrategy.parse(file);

    const transactions: TransactionEntity[] = BankerTransfer.map((transfer: STRTTRN) => {
      new TransactionEntity({
        tranferType: transfer.TRNTYPE,
        dipostedDate: transfer.DTPOSTED.date ? transfer.DTPOSTED.date : transfer.DTPOSTED.datetime,
        description: transfer.MEMO,
        transactionAmount: +transfer.TRNAMT,
        userId: userId
      })
    });

    return 'OK'
  }
}
