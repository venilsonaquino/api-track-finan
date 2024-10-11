import { TransactionEntity } from 'src/transactions/entities/transaction.entity';
import { UserEntity } from 'src/users/entities/user.entity';

export class WalletEntity {
  id: string;
  name: string;
  description: string;
  walletType: string | null;
  icon: string;
  color: string;
  balance: number;
  userId: string;
  user?: UserEntity; 
  transactions?: TransactionEntity[]; 
}
