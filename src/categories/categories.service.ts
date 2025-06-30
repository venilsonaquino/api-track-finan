import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryModel } from './models/category.model';
import { InjectModel } from '@nestjs/sequelize';
import { CategoryEntity } from './entities/category.entity';
import { Op } from 'sequelize';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(CategoryModel)
    private readonly categoryModel: typeof CategoryModel,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const category = new CategoryEntity({
        name: createCategoryDto.name,
        description: createCategoryDto.description,
        icon: createCategoryDto.icon,
        color: createCategoryDto.color,
        userId: createCategoryDto.userId,
      });

      return await this.categoryModel.create(category);
    } catch (error) {
      throw Error(error);
    }
  }

  async findAllByUser(userId: string) {
    return await this.categoryModel.findAll({
      where: {
        [Op.or]: [{ userId }, { userId: null }],
      },
      order: [['created_at', 'DESC']],
    });
  }

  async findOne(id: string, userId: string) {
    const category = await this.categoryModel.findOne({
      where: { id, userId },
    });

    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }

    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const [affectedCount, updated] = await this.categoryModel.update(
      updateCategoryDto,
      {
        where: { id, userId: updateCategoryDto.userId },
        returning: true,
      },
    );

    if (affectedCount == 0 && updated.length == 0) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }

    return updated[0];
  }

  async remove(id: string, userId: string) {
    const deletedCount = await this.categoryModel.destroy({
      where: { id, userId },
    });

    if (deletedCount === 0) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
    return;
  }
}
