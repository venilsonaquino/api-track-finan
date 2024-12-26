import { TransactionEntity } from "src/transactions/entities/transaction.entity";

export function groupTransactionsByDate(transactions: TransactionEntity[]) {
  return transactions.reduce((group, transaction) => {
    const isoDate = new Date(transaction.depositedDate).toISOString().split('T')[0];

    if (!group[isoDate]) {
      group[isoDate] = {
        date: isoDate,
        endOfDayBalance: null,
        transactions: [],
      };
    }

    group[isoDate].transactions.push(transaction);
    return group;
  }, {});
}

export function groupTransactionsAsArray(transactions: TransactionEntity[]) {
  const grouped = groupTransactionsByDate(transactions);
  return Object.values(grouped);
}