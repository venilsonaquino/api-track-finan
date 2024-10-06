import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { TransactionsModule } from 'src/transactions/transactions.module';
import { FileModel } from './models/file.model';

@Module({
  imports: [SequelizeModule.forFeature([FileModel]), TransactionsModule],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
