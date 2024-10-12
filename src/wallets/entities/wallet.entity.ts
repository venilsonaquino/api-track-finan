import { TransactionEntity } from 'src/transactions/entities/transaction.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { ulid } from 'ulid';

export class WalletEntity {
  id: string;
  name: string;
  description: string;
  walletType: string | null;
  icon: string;
  color: string;
  balance: number;
  userId: string;

  constructor(params: Partial<{
    id: string;
    name: string;
    description: string;
    walletType: string | null;
    icon: string;
    color: string;
    balance: number;
    userId: string;
  }>) {
    this.id = params.id || ulid();
    this.name = params.name;
    this.description = params.description;
    this.walletType = params.walletType;
    this.icon = params.icon;
    this.color = params.color;
    this.balance = params.balance;
    this.userId = params.userId;
  }
}
