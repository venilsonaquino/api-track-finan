import { ulid } from 'ulid';

export class TransactionEntity {
  id: string;
  dipostedDate: string;
  description: string;
  amount: number;
  userId: string;
  fitId: string;
  transferType: string | null;
  categoryId: string;
  walletId: string;
  isRecurring?: boolean | null;
  recurringMonths?: number | null;

  constructor(params: Partial<{
    id: string;
    dipostedDate: string;
    description: string;
    amount: number;
    userId: string;
    fitId: string;
    transferType: string | null;
    categoryId: string | null;
    walletId: string;
    isRecurring?: boolean | null;
    recurringMonths?: number | null;
  }>) {
    this.id = params.id || ulid();
    this.dipostedDate = params.dipostedDate;
    this.description = params.description;
    this.amount = params.amount;
    this.userId = params.userId;
    this.fitId = params.fitId;
    this.transferType = params.transferType;
    this.categoryId = params.categoryId;
    this.walletId = params.walletId;
    this.isRecurring = params.isRecurring;
    this.recurringMonths = params.recurringMonths;
  }
}