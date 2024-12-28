import { Injectable } from '@nestjs/common';
import { WalletsService } from '../wallets.service';

@Injectable()
export class WalletFacade {
  constructor(private readonly walletsService: WalletsService) {}

  async getWalletBalance(userId: string): Promise<number> {
    return this.walletsService.findBalanceCurrent(userId);
  }
}
