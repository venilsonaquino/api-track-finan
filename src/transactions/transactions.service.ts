import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectModel } from '@nestjs/sequelize';
import { TransactionModel } from './models/transaction.model';
import { TransactionEntity } from './entities/transaction.entity';
import { Op } from 'sequelize';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(TransactionModel)
    private readonly transactionalModel: typeof TransactionModel,
  ) {}

  async create(createTransactionDto: CreateTransactionDto, userId: string) {
    try {

      const transaction = new TransactionEntity({
        transferType: createTransactionDto.transferType,
        depositedDate: createTransactionDto.depositedDate,
        description: createTransactionDto.description,
        amount: +createTransactionDto.amount,
        isRecurring: createTransactionDto.isRecurring,
        recurringMonths: createTransactionDto.recurringMonths,
        userId: userId,
        categoryId: createTransactionDto.categoryId,
        fitId: createTransactionDto.fitId,
        walletId: createTransactionDto.walletId
      });

      return await this.transactionalModel.create(transaction);
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw new InternalServerErrorException('Failed to create transaction');
    }
  }

  async createMany(
    createTransactionDtos: CreateTransactionDto[], 
    userId: string 
  ) {
    try {
      const transactions = createTransactionDtos.map(dto => new TransactionEntity({
        transferType: dto.transferType,
        depositedDate: dto.depositedDate,
        description: dto.description,
        amount: +dto.amount,
        isRecurring: dto.isRecurring,
        recurringMonths: dto.recurringMonths,
        userId: userId,
        categoryId: dto.categoryId,
        fitId: dto.fitId,
        walletId: dto.walletId
      }));
  
  
      return await this.transactionalModel.bulkCreate(transactions);
    } catch (error) {
      console.error('Error creating transactions:', error.message);
      throw new InternalServerErrorException(error.message);
    }
  }
  

  async findAllAndDateRange(userId: string, startDate: string, endDate: string) {
    const transactions = await this.transactionalModel.findAll({
      where: { 
        userId,
        depositedDate: {
          [Op.between]: [startDate, endDate],
        },
      },
      order: [['depositedDate', 'DESC']],
      include: ['category', 'wallet'],
    });

    const groupBydepositedDate = transactions.reduce((group, transaction) => {
      const isoDate = new Date(transaction.depositedDate).toISOString().split('T')[0]; // Formato 'YYYY-MM-DD'
    
      // Verifica se a data já está no grupo
      if (!group[isoDate]) {
        group[isoDate] = {
          date: isoDate,
          endOfDayBalance: null,
          transactions: []
        };
      }
    
      group[isoDate].transactions.push(transaction);
      return group;
    }, {});
    
    const groupedTransactionsArray = Object.values(groupBydepositedDate);

    return groupedTransactionsArray;
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
      transferType: updateTransactionDto.transferType,
      depositedDate: updateTransactionDto.depositedDate,
      description: updateTransactionDto.description,
      amount: +updateTransactionDto.amount,
      isRecurring: updateTransactionDto.isRecurring,
      recurringMonths: updateTransactionDto.recurringMonths,
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
      include: ['category'],
      order: [['created_at', 'DESC']],
    });

    return previousTransactions;
  }
  
}
