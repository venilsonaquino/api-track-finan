import { Injectable } from '@nestjs/common';
import { CreateOfxFileDto } from './dto/create-ofx-file.dto';
import { UpdateOfxFileDto } from './dto/update-ofx-file.dto';
import { InjectModel } from '@nestjs/sequelize';
import { OfxFileModel } from './models/ofx-file.model';
import { OfxFileEntity } from './entities/ofx-file.entity';

@Injectable()
export class OfxFileService {

  constructor(
    @InjectModel(OfxFileModel) 
    private readonly ofxFileModel: typeof OfxFileModel,
  ) {}

  async create(createOfxFileDto: CreateOfxFileDto) {
    //TODO: pegar o ID do usuario Logado na Aplicação
    const ofxFile = new OfxFileEntity({
      fileName: createOfxFileDto.fileName,
      userId: createOfxFileDto.userId
    })

    return await this.ofxFileModel.create(ofxFile)
  }

  async findAll() {
    return await this.ofxFileModel.findAll();
  }

  async findOne(id: string) {
    return await this.ofxFileModel.findOne({where: {id}});
  }

  async update(id: string, updateOfxFileDto: UpdateOfxFileDto) {
    return await this.ofxFileModel.update(updateOfxFileDto, {
      where: {id},
      returning: true
    })
  }

  async remove(id: string) {
    return await this.ofxFileModel.destroy({where: {id}});
  }
}
