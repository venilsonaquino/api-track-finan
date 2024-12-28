import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { TransactionModel } from './models/transaction.model';
import { WalletsModule } from 'src/wallets/wallets.module';

@Module({
  imports: [SequelizeModule.forFeature([TransactionModel]), WalletsModule],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
