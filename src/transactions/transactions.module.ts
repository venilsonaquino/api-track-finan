import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { TransactionModel } from './models/transaction.model';

@Module({
  imports: [SequelizeModule.forFeature([TransactionModel])],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
