import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectModel } from '@nestjs/sequelize';
import { TransactionModel } from './models/transaction.model';
import { TransactionEntity } from './entities/transaction.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(TransactionModel)
    private readonly transactionalModel: typeof TransactionModel,
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    try {

      const transaction = new TransactionEntity({
        balanceAfter: createTransactionDto.balanceAfter,
        date: createTransactionDto.date,
        description: createTransactionDto.description,
        userId: createTransactionDto.userId,
        categoryId: createTransactionDto.categoryId
      });
      
      return await this.transactionalModel.create(transaction);
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw new InternalServerErrorException('Failed to create transaction');
    }
  }

  findAll() {
    return this.transactionalModel.findAll();
  }

  findOne(id: string) {
    return this.transactionalModel.findOne({where: {id}});
  }

  update(id: string, updateTransactionDto: UpdateTransactionDto) {
    return this.transactionalModel.update(updateTransactionDto, {
      where: { id },
      returning: true
    });
  }

  remove(id: string) {
    return this.transactionalModel.destroy({ where: { id } });
  }
}
