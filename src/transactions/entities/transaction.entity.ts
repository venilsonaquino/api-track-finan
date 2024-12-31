import { ulid } from 'ulid';

export class TransactionEntity {
  id: string;
  depositedDate: string;
  description: string;
  amount: number;
  userId: string;
  transferType: string | null;
  categoryId: string;
  walletId: string;
  isRecurring?: boolean | null;
  recurringMonths?: number | null;
  fitId?: string | null;

  constructor(params: Partial<{
    id: string;
    depositedDate: string;
    description: string;
    amount: number;
    userId: string;
    transferType: string | null;
    categoryId: string | null;
    walletId: string;
    isRecurring?: boolean | null;
    recurringMonths?: number | null;
    fitId?: string;
  }>) {
    this.id = params.id || ulid();
    this.depositedDate = params.depositedDate;
    this.description = params.description;
    this.amount = params.amount;
    this.userId = params.userId;
    this.transferType = params.transferType;
    this.categoryId = params.categoryId;
    this.walletId = params.walletId;
    this.isRecurring = params.isRecurring;
    this.recurringMonths = params.recurringMonths;
    this.fitId = params.fitId;
  }

  public static calculateIncome(transactions: TransactionEntity[]): number {
    return transactions
      .filter(t => t.amount > 0 && t.transferType === 'CREDIT')
      .reduce((sum, t) => sum + t.amount, 0);
  }

  public static calculateExpense(transactions: TransactionEntity[]): number {
    return transactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + t.amount, 0);
  }

  public static calculateMonthlyBalance(income: number, expense: number): number {
    return income + expense;
  }
}