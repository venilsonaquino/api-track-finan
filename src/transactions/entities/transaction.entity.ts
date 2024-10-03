import { ulid } from 'ulid';

export class TransactionEntity {
  id: string;
  date: string;
  description: string;
  amount: number;
  balanceAfter: number | null;
  userId: string;
  categoryId?: string;

  constructor(params: Partial<{
    id: string;
    date: string;
    description: string;
    amount: number;
    balanceAfter: number;
    userId: string;
    categoryId?: string | null;
  }>) {
    this.id = params.id || ulid();
    this.date = params.date;
    this.description = params.description;
    this.amount = params.amount;
    this.balanceAfter = params.balanceAfter;
    this.userId = params.userId;
    this.categoryId = params.categoryId;
  }
}