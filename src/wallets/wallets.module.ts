import { Module } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { WalletsController } from './wallets.controller';
import { WalletModel } from './models/wallet.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { WalletFacade } from './facades/wallet.facade';

@Module({
  imports: [SequelizeModule.forFeature([WalletModel])],
  controllers: [WalletsController],
  providers: [WalletsService, WalletFacade],
  exports: [WalletFacade]
})
export class WalletsModule {}
