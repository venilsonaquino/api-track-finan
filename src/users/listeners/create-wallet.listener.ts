import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { UserCreatedEvent } from '../events/user-created.event';
import { WalletFacade } from 'src/wallets/facades/wallet.facade';

@Injectable()
export class CreateWalletListener {
  constructor(private readonly walletFacade: WalletFacade) {}

  @OnEvent('user.created')
  async handleUserCreatedEvent(event: UserCreatedEvent) {
    await this.walletFacade.createWallet(event.userId);
  }
}
