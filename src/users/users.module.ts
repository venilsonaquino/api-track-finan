import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserModel } from './models/user.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { CreateCategoriesListener } from './listeners/create-categories.listener';
import { CategoriesModule } from 'src/categories/categories.module';

@Module({
  imports: [SequelizeModule.forFeature([UserModel]), CategoriesModule],
  controllers: [UsersController],
  providers: [UsersService, CreateCategoriesListener],
  exports: [UsersService],
})
export class UsersModule {}
