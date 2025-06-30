import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { CategoryModel } from './models/category.model';
import { CategoryFacade } from './facades/category.facade';

@Module({
  imports: [SequelizeModule.forFeature([CategoryModel])],
  controllers: [CategoriesController],
  providers: [CategoriesService, CategoryFacade],
  exports: [CategoryFacade],
})
export class CategoriesModule {}
