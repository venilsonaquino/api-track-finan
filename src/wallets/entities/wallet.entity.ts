import { ulid } from 'ulid';

export class WalletEntity {
  id: string;
  name: string;
  description: string;
  walletType: string | null;
  balance: number;
  userId: string;
  bankId: string | null;

  constructor(params: Partial<{
    id: string;
    name: string;
    description: string;
    walletType: string | null;
    balance: number;
    userId: string;
    bankId: string | null;
  }>) {
    this.id = params.id || ulid();
    this.name = params.name;
    this.description = params.description;
    this.walletType = params.walletType;
    this.balance = params.balance;
    this.userId = params.userId;
    this.bankId = params.bankId;
  }
}
