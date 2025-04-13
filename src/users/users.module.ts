import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserModel } from './models/user.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { CreateCategoriesListener } from './listeners/create-categories.listener';
import { CategoriesModule } from 'src/categories/categories.module';
import { WalletsModule } from 'src/wallets/wallets.module';
import { CreateWalletListener } from './listeners/create-wallet.listener';
import { MailModule } from 'src/shared/mail/mail.module';
import { LoggerModule } from '../config/logging/logger.module';

@Module({
  imports: [
    SequelizeModule.forFeature([UserModel]), 
    CategoriesModule, 
    WalletsModule,
    MailModule,
    LoggerModule
  ],
  controllers: [UsersController],
  providers: [UsersService, CreateCategoriesListener, CreateWalletListener],
  exports: [UsersService],
})
export class UsersModule {}
