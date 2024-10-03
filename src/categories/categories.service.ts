import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryModel } from './models/category.model';
import { InjectModel } from '@nestjs/sequelize';
import { CategoryEntity } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(CategoryModel)
    private readonly categoryModel: typeof CategoryModel,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {

    const category = new CategoryEntity({
      name: createCategoryDto.name,
      description: createCategoryDto.description,
      icon: createCategoryDto.icon,
      userId: createCategoryDto.userId,
    })

    return await this.categoryModel.create(category);
  }

  async findAll() {
    return await this.categoryModel.findAll();
  }

  async findOne(id: string) {
    return await this.categoryModel.findOne({where: {id}});
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    return await this.categoryModel.update(updateCategoryDto, {
      where: {id},
      returning: true
    });
  }

  async remove(id: string) {
    return await this.categoryModel.destroy({where: {id}});
  }
}
