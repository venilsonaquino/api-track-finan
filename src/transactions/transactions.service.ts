import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectModel } from '@nestjs/sequelize';
import { TransactionModel } from './models/transaction.model';
import { TransactionEntity } from './entities/transaction.entity';
import { Op, ValidationError } from 'sequelize';
import { DateRangeDto } from './dto/date-range.dto';
import { groupTransactionsAsArray } from 'src/common/utils/group-transaction-by-date';
import { WalletFacade } from 'src/wallets/facades/wallet.facade';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(TransactionModel)
    private readonly transactionalModel: typeof TransactionModel,
    private readonly walletFacade: WalletFacade
  ) {}

  private mapToEntity(model: TransactionModel): TransactionEntity {
    return new TransactionEntity({
      id: model.id,
      depositedDate: model.depositedDate,
      description: model.description,
      amount: model.amount,
      userId: model.userId,
      categoryId: model.categoryId,
      walletId: model.walletId,
      isRecurring: model.isRecurring,
      fitId: model.fitId,
      isInstallment: model.isInstallment,
      installmentInterval: model.installmentInterval as "DAILY" | "MONTHLY" | "WEEKLY" | "YEARLY",
      installmentNumber: model.installmentNumber,
      installmentEndDate: model.installmentEndDate,
    });
  }

  async create(createTransactionDto: CreateTransactionDto, userId: string) {
    try {

      const transaction = new TransactionEntity({
        depositedDate: createTransactionDto.depositedDate,
        description: createTransactionDto.description,
        amount: +createTransactionDto.amount,
        userId: userId,
        categoryId: createTransactionDto.categoryId,
        fitId: createTransactionDto.fitId,
        walletId: createTransactionDto.walletId,
        isRecurring: createTransactionDto.isRecurring,
        isInstallment: createTransactionDto.isInstallment,
        installmentNumber: createTransactionDto.installmentNumber,
        installmentInterval: createTransactionDto.installmentInterval,
        accountId: createTransactionDto.accountId,
        accountType: createTransactionDto.accountType,
        bankId: createTransactionDto.bankId,
        bankName: createTransactionDto.bankName,
        currency: createTransactionDto.currency,
        transactionDate: createTransactionDto.transactionDate,
        transactionType: createTransactionDto.transactionType,
      });

      return await this.transactionalModel.create(transaction);
    } catch (error) {
      console.error('Error creating transaction:', error);
      const detailMessage = error?.parent?.detail || error?.message;
      throw new InternalServerErrorException(detailMessage);
    }
  }

  async createMany(
    createTransactionDtos: CreateTransactionDto[], 
    userId: string 
  ) {
    try {
      const transactions = createTransactionDtos.map(dto => new TransactionEntity({
        depositedDate: dto.depositedDate,
        description: dto.description,
        amount: +dto.amount,
        userId: userId,
        categoryId: dto.categoryId,
        fitId: dto.fitId,
        walletId: dto.walletId,
        isRecurring: dto.isRecurring,
        isInstallment: dto.isInstallment,
        installmentNumber: dto.installmentNumber,
        installmentInterval: dto.installmentInterval,
        accountId: dto.accountId,
        accountType: dto.accountType,
        bankId: dto.bankId,
        bankName: dto.bankName,
        currency: dto.currency,
        transactionDate: dto.transactionDate,
        transactionType: dto.transactionType,
      }));
  
      return await this.transactionalModel.bulkCreate(transactions);
    } catch (error) {
      console.error('Error creating transaction:', error);
      const detailMessage = error?.parent?.detail || error?.message;
      throw new InternalServerErrorException(detailMessage);
    }
  }

  async findAllAndDateRange(userId: string, query: DateRangeDto) {

    const { start_date, end_date, category_ids, wallet_ids } = query;

    const startDate = start_date;
    const endDate = end_date;

    const whereCondition: any = {
      userId,
      depositedDate: {
        [Op.between]: [startDate, endDate],
      },
    };

    if(category_ids){
      const categoryIdsArray = category_ids.split(',');
      whereCondition.categoryId = {
        [Op.in]: categoryIdsArray
      };
    }

    if(wallet_ids){
      const walletIdsArray = wallet_ids.split(',');
      whereCondition.walletId = {
        [Op.in]: walletIdsArray
      };
    }

    const transactions = await this.transactionalModel.findAll({
      where: whereCondition,
      order: [['depositedDate', 'DESC']],
      include: ['category', 'wallet'],
    });

    const balance = await this.walletFacade.getWalletBalance(userId);
    const transactionEntities = transactions.map(t => this.mapToEntity(t));
    const income = TransactionEntity.calculateIncome(transactionEntities);
    const expense = TransactionEntity.calculateExpense(transactionEntities);
    const monthly_balance = TransactionEntity.calculateMonthlyBalance(income, expense);

    const groupBydepositedDate = groupTransactionsAsArray(transactionEntities);
    return {
      "records": groupBydepositedDate,
      "summary": {
        "current_balance": balance,
        "monthly_income": income,
        "monthly_expense": expense,
        "monthly_balance": monthly_balance
      }
    }
  }

  async findOne(id: string, userId: string) {
    const transaction = await this.transactionalModel.findOne({
      where: {id, userId},
      include: ['user', 'category'],
    });

    if(!transaction){
      throw new NotFoundException(`Transaction with id ${id} not found`)
    }

    return transaction;
  }

  async update(id: string, updateTransactionDto: UpdateTransactionDto, userId: string) {

    const transaction = new TransactionEntity({
      depositedDate: updateTransactionDto.depositedDate,
      description: updateTransactionDto.description,
      amount: +updateTransactionDto.amount,
      isRecurring: updateTransactionDto.isRecurring,
      userId: userId,
      categoryId: updateTransactionDto.categoryId,
      fitId: updateTransactionDto.fitId,
      walletId: updateTransactionDto.walletId
    });


    const [affectedCount, updated] = await this.transactionalModel.update(transaction, {
      where: { id, userId },
      returning: true
    });

    if (affectedCount == 0 && updated.length == 0){
      throw new NotFoundException(`Transaction with id ${id} not found`);
    }

    return updated[0];
  }


  
  async remove(id: string, userId: string) {
    const deletedCount = await this.transactionalModel.destroy({
      where: { id, userId } 
    });

    if (deletedCount === 0) {
      throw new NotFoundException(`Transaction with id ${id} not found`);
    }
    return;
  }

  async previousTransactions(uniqueDescriptions: string[], userId: string) {

    const previousTransactions = await this.transactionalModel.findAll({
      where: {
        description: {
          [Op.in]: uniqueDescriptions
        },
        userId: userId
      },
      attributes: ['description', 'created_at'],
      include: ['category', 'wallet'],
      order: [['created_at', 'DESC']],
    });

    return previousTransactions;
  }
  
  async previousFitIds(fitIds: string[], userId: string): Promise<string[]> {
    try {
      // Busca por transações que possuem fitId e o userId correspondente
      const transactions = await this.transactionalModel.findAll({
        where: {
          fitId: fitIds,
          userId: userId
        },
        attributes: ['fitId']
      });
  
      return transactions.map(transaction => transaction.fitId);
    } catch (error) {
      console.error('Error fetching previous fitIds: ', error);
      const detailMessage = error?.parent?.detail || error?.message;
      throw new InternalServerErrorException(detailMessage);

    }
  }

}
