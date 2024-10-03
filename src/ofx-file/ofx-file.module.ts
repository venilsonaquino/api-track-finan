import { Module } from '@nestjs/common';
import { OfxFileService } from './ofx-file.service';
import { OfxFileController } from './ofx-file.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { OfxFileModel } from './models/ofx-file.model';

@Module({
  imports: [SequelizeModule.forFeature([OfxFileModel])],
  controllers: [OfxFileController],
  providers: [OfxFileService],
})
export class OfxFileModule {}
