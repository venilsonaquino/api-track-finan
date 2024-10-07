import { ulid } from 'ulid';

export class TransactionEntity {
  id: string;
  tranferType: string | null;
  dipostedDate: string;
  description: string;
  transactionAmount: number;
  userId: string;
  fitId: string;
  balanceAfter?: number | null;
  categoryId?: string;
  isRecurring?: boolean | null;
  recurringMonths?: number | null;
  fileId? : string | null;

  constructor(params: Partial<{
    id: string;
    tranferType: string;
    dipostedDate: string;
    description: string;
    transactionAmount: number;
    userId: string;
    fitId: string;
    balanceAfter?: number | null;
    categoryId?: string | null;
    isRecurring?: boolean | null;
    recurringMonths?: number | null;
    fileId? : string | null;
  }>) {
    this.id = params.id || ulid();
    this.tranferType =  params.tranferType
    this.dipostedDate = params.dipostedDate;
    this.description = params.description;
    this.transactionAmount = params.transactionAmount;
    this.userId = params.userId;
    this.fitId = params.fitId;
    this.balanceAfter = params.balanceAfter;
    this.categoryId = params.categoryId;
    this.isRecurring = params.isRecurring;
    this.recurringMonths = params.recurringMonths;
    this.fileId = params.fileId
  }
}