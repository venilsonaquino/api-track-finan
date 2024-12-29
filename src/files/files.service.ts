import { Injectable } from '@nestjs/common';
import { FileEntity } from './entities/file.entity';
import { FilesFactory } from './files.factory';
import { FileDto } from './dto/file.dto';
import { TransactionsService } from 'src/transactions/transactions.service';

@Injectable()
export class FilesService {
  constructor(private readonly transactionsService: TransactionsService) {}

  async uploadFile(file: Express.Multer.File, userId: string): Promise<FileDto[]> {

    const fileEntity = new FileEntity({
      fileName: file.originalname
    });
    const fileType = fileEntity.getFileType();

    const processingStrategy = FilesFactory.getStrategy(fileType);
    let bankTransfer = processingStrategy.parse(file);

    const onlyDescriptionsOfTransaction = Array.from(new Set(bankTransfer.map((transfer: FileDto) => transfer.description)));

    const onlyFitIdOfTransaction = Array.from(new Set(
      bankTransfer.map((transfer: FileDto) => 
        typeof transfer.fitId === 'string' ? transfer.fitId : transfer.fitId?.transactionCode
      )
    ));

    const previousTransactions = await this.transactionsService.previousTransactions(onlyDescriptionsOfTransaction, userId);
    
    const existingFitIds = await this.transactionsService.previousFitIds(onlyFitIdOfTransaction, userId);
    const descriptionCategoryMap = new Map<string, any>();
    
    previousTransactions.forEach(transaction => {
      if (!descriptionCategoryMap.has(transaction.description)) {
        descriptionCategoryMap.set(transaction.description, transaction.category);
      }
    });

    bankTransfer = bankTransfer.map((transfer: FileDto) => {

      const fitIdToCheck = typeof transfer.fitId === 'string' ? transfer.fitId : transfer.fitId?.transactionCode;

      return {
        ...transfer,
        category: descriptionCategoryMap.get(transfer.description) || null,
        isFitIdAlreadyExists: existingFitIds.includes(fitIdToCheck)
      }
    })

    return bankTransfer
  }
}
