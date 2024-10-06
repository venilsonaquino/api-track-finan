import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectModel } from '@nestjs/sequelize';
import { TransactionModel } from './models/transaction.model';
import { TransactionEntity } from './entities/transaction.entity';
import { BankTransferType } from 'src/common/types/bank-transfer.type';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(TransactionModel)
    private readonly transactionalModel: typeof TransactionModel,
  ) {}

  async create(createTransactionDto: CreateTransactionDto, userId: string) {
    try {

      const transaction = new TransactionEntity({
        balanceAfter: createTransactionDto.balanceAfter,
        tranferType: createTransactionDto.tranferType,
        dipostedDate: createTransactionDto.dipostedDate,
        description: createTransactionDto.description,
        transactionAmount: createTransactionDto.transactionAmount,
        userId: userId,
        categoryId: createTransactionDto.categoryId
      });

      return await this.transactionalModel.create(transaction);
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw new InternalServerErrorException('Failed to create transaction');
    }
  }

  async createMany(BankerTransfer: BankTransferType[], userId: string) {
    try {
      const transactions = BankerTransfer.map((banker) => {
        return new TransactionEntity({
          dipostedDate: banker.dipostedDate,
          transactionAmount: +banker.transactionAmount,
          tranferType: banker.transferType,
          description: banker.description,
          userId: userId
        });
      });
  
      return await this.transactionalModel.bulkCreate(transactions);
    } catch (error) {
      console.error('Error creating transactions:', error.message);
      throw new InternalServerErrorException('Failed to create transactions');
    }
  }
  

  async findAllByUser(userId: string) {
    return await this.transactionalModel.findAll({
      where: { userId },
      order: [['date', 'DESC']],
    });
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
    const [affectedCount, updated] = await this.transactionalModel.update(updateTransactionDto, {
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
}
