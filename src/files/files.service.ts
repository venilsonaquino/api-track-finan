import { Injectable } from '@nestjs/common';
import { FileEntity } from './entities/file.entity';
import { FilesFactory } from './files.factory';
import { FileDto } from './dto/file.dto';
import { TransactionsService } from 'src/transactions/transactions.service';
import { TransactionEntity } from 'src/transactions/entities/transaction.entity';

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
    const uniqueDescriptions = getUniqueDescriptions(transactions);
    const uniqueFitIds = getUniqueFitIds(transactions);
  
    const transactionsByDescriptions = await this.transactionsService.getTransactionsForSuggestions(uniqueDescriptions, userId);
    const transactionsByFitIds = await this.transactionsService.getByFitIds(uniqueFitIds, userId);
  
    const categoryMap = this.createSuggestionMap(transactionsByDescriptions, 'category');
    const walletMap = this.createSuggestionMap(transactionsByDescriptions, 'wallet');
  
    const enrichedTransactions =  transactions.map(t => this.enrichTransaction(t, categoryMap, walletMap, transactionsByFitIds));
    return enrichedTransactions;
  }

  private enrichTransaction(
    transaction: FileDto,
    categoryMap: Map<string, any>,
    walletMap: Map<string, any>,
    transactionExists: TransactionEntity[]
  ): FileDto {
    const fitId = getFitId(transaction);
    const isFitIdAlreadyExists = transactionExists.some(t => t.fitId === fitId);

    if(isFitIdAlreadyExists) {
      const existingTransaction = transactionExists.find(t => t.fitId === fitId);
      return {
        ...transaction,
        category: existingTransaction.category || null,
        wallet: existingTransaction.wallet || null,
        isFitIdAlreadyExists
      };
    }

    return {
      ...transaction,
      category: categoryMap.get(transaction.description) || null,
      wallet: walletMap.get(transaction.description) || null,
      isFitIdAlreadyExists
    };
  }

  private createSuggestionMap(transactions: any[], field: 'category' | 'wallet'): Map<string, any> {
    const map = new Map<string, any>();
    transactions.forEach(t => {
      if (!map.has(t.description)) {
        map.set(t.description, t[field]);
      }
    });
    return map;
  }
}

// Funções auxiliares
function getUniqueDescriptions(transactions: FileDto[]): string[] {
  return [...new Set(transactions.map(t => t.description))];
}

function getUniqueFitIds(transactions: FileDto[]): (string | undefined)[] {
  return [...new Set(transactions.map(getFitId))];
}

function getFitId(t: FileDto): string | undefined {
  return typeof t.fitId === 'string' ? t.fitId : t.fitId?.transactionCode;
}
