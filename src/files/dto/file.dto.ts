export class FileDto {
  transferType: string;
  depositedDate: string;
  description: string;
  amount: string;
  fitId: string | {
    date: string;
    protocol: string;
    transactionCode: string;
  };
  category: string | null;
  isRecurring: boolean | null;
  recurringMonths: number | null;
  wallet: string | null;
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
