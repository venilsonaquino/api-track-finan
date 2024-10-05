import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
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
        amount: createTransactionDto.amount,
        userId: createTransactionDto.userId,
        categoryId: createTransactionDto.categoryId
      });
      
      return await this.transactionalModel.create(transaction);
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw new InternalServerErrorException('Failed to create transaction');
    }
  }

  async findAll() {
    return await this.transactionalModel.findAll();
  }

  async findOne(id: string) {
    const transaction = await this.transactionalModel.findOne({where: {id}});

    if(!transaction){
      throw new NotFoundException(`Transaction with id ${id} not found`)
    }

    return transaction;

  }

  async update(id: string, updateTransactionDto: UpdateTransactionDto) {
    const [affectedCount, updated] = await this.transactionalModel.update(updateTransactionDto, {
      where: { id },
      returning: true
    });

    if (affectedCount == 0 && updated.length == 0){
      throw new NotFoundException(`Transaction with id ${id} not found`);
    }

    return updated[0];
  }


  
  async remove(id: string) {
    const deletedCount = await this.transactionalModel.destroy({ where: { id } });

    if (deletedCount === 0) {
      throw new NotFoundException(`Transaction with id ${id} not found`);
    }
    return;
  }
}
