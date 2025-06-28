import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { WalletModel } from './models/wallet.model';
import { WalletEntity } from './entities/wallet.entity';
import MoneyHelper from './helpers/money.helper';

@Injectable()
export class WalletsService {
  constructor(
    @InjectModel(WalletModel)
    private readonly walletModel: typeof WalletModel,
  ) {}

  async create(createWalletDto: CreateWalletDto, userId: string): Promise<WalletEntity> {
    try {

      const walletEntity = new WalletEntity({
        name: createWalletDto.name,
        description: createWalletDto.description,
        walletType: createWalletDto.walletType,
        balance: MoneyHelper.toCents(createWalletDto.balance),
        userId: userId,
        bankId: createWalletDto.bankId || null
      });

      return await this.walletModel.create(walletEntity);
      
    } catch (error) {
      console.error('Error creating wallet:', error);
      throw new InternalServerErrorException('Failed to create wallet');
    }
  }

  async findAll(userId: string): Promise<WalletEntity[]> {
    const wallets = await this.walletModel.findAll({where: {userId}});
    return wallets
  }

  async findOne(id: string, userId: string): Promise<WalletEntity> {
    const wallet = await this.walletModel.findOne({where: {id, userId}});
    if (!wallet) {
      throw new NotFoundException(`Wallet with ID ${id} not found`);
    }

    return wallet
  }

  async update(id: string, updateWalletDto: UpdateWalletDto, userId: string): Promise<WalletEntity> {
    const [affectedCount, updated] = await this.walletModel.update(updateWalletDto, {
      where: { id, userId },
      returning: true
    });

    if (affectedCount == 0 && updated.length == 0){
      throw new NotFoundException(`Wallet with id ${id} not found`);
    }

    return updated[0];
  }

  async remove(id: string, userId: string): Promise<void> {
    const deletedCount = await this.walletModel.destroy({
      where: { id, userId } 
    });

    if (deletedCount === 0) {
      throw new NotFoundException(`Wallet with id ${id} not found`);
    }
    
    return;
  }

  async findBalanceCurrent(userId: string): Promise<number> {
    const totalBalance = await this.walletModel.sum('balance', { where: { userId } });
    return totalBalance || 0;
  }
}