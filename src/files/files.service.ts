import { Injectable } from '@nestjs/common';
import { FileEntity } from './entities/file.entity';
import { FilesFactory } from './files.factory';
import { FileDto } from './dto/file.dto';
import { TransactionsService } from 'src/transactions/transactions.service';

@Injectable()
export class FilesService {
  constructor(private readonly transactionsService: TransactionsService) {}

  extractTransactionsFromFile(file: Express.Multer.File): FileDto[] {
    const fileEntity = new FileEntity({ fileName: file.originalname });
    const fileType = fileEntity.getFileType();
    const processingStrategy = FilesFactory.getStrategy(fileType);
    return processingStrategy.parse(file);
  }

  async processTransactions(transactions: FileDto[], userId: string): Promise<FileDto[]> {
    const uniqueDescriptions = [...new Set(transactions.map(t => t.description))];
    const uniqueFitIds = [...new Set(
      transactions.map(t => typeof t.fitId === 'string' ? t.fitId : t.fitId?.transactionCode)
    )];
  
    const pastTransactions = await this.transactionsService.previousTransactions(uniqueDescriptions, userId);
    const existingFitIds = await this.transactionsService.previousFitIds(uniqueFitIds, userId);
  
    const categoryMap = new Map<string, any>();
    const walletMap = new Map<string, any>();
  
    pastTransactions.forEach(t => {
      if (!categoryMap.has(t.description)) categoryMap.set(t.description, t.category);
      if (!walletMap.has(t.description)) walletMap.set(t.description, t.wallet);
    });
  
    return transactions.map(t => {
      const fitId = typeof t.fitId === 'string' ? t.fitId : t.fitId?.transactionCode;
      return {
        ...t,
        category: categoryMap.get(t.description) || null,
        wallet: walletMap.get(t.description) || null,
        isFitIdAlreadyExists: existingFitIds.includes(fitId)
      };
    });
  }
}
