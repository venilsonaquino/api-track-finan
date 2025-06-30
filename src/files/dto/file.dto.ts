import { CategoryEntity } from 'src/categories/entities/category.entity';
import { WalletEntity } from 'src/wallets/entities/wallet.entity';
export class FileDto {
  transferType: string;
  depositedDate: string;
  description: string;
  amount: string;
  fitId:
    | string
    | {
        date: string;
        protocol: string;
        transactionCode: string;
      };
  category: string | CategoryEntity | null;

  // Fixo
  isRecurring: boolean | null;
  recurrenceType: 'INDEFINITE' | 'FIXED' | null;
  recurringInterval: 'DAILY' | 'MONTHLY' | 'WEEKLY' | 'YEARLY' | null;

  // Parcelamento
  isInstallment: boolean | null;
  installmentTotal: number | null;
  installmentNumber: number | null;
  installmentEndDate: string | null;

  wallet: string | WalletEntity | null;
  isFitIdAlreadyExists?: boolean;
  bankName?: string;
  bankId?: string;
  accountId?: string;
  accountType?: string;
  currency?: string;
  transactionDate?: string;
  checkNumber?: string;
  transactionSource?: 'BANK' | 'CREDIT_CARD';
  balance?: string;
  balanceDate?: string;
}
