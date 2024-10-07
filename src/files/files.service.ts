import { Injectable } from '@nestjs/common';
import { FileEntity } from './entities/file.entity';
import { FilesFactory } from './files.factory';
import { FileModel } from './models/file.model';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class FilesService {
  constructor(
    @InjectModel(FileModel)
    private readonly fileModel: typeof FileModel,
  ) {}

  async create(file: Express.Multer.File, userId: string): Promise<FileEntity> {

    const fileEntity = new FileEntity({
      fileName: file.originalname,
      userId: userId
    });

    const createdFile = await this.fileModel.create(fileEntity);
    const createdFileEntity = new FileEntity(createdFile);
    return createdFileEntity
  }

  async uploadFile(file: Express.Multer.File) {

    const fileEntity = new FileEntity({
      fileName: file.originalname
    });
    const fileType = fileEntity.getFileType();

    const processingStrategy = FilesFactory.getStrategy(fileType);
    const bankTransfer = processingStrategy.parse(file);

    return bankTransfer
  }
}
