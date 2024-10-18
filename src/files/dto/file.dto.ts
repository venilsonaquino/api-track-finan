export class FileDto {
  transferType: string; // Correção aqui
  depositedDate: string; // Corrigido de 'dipostedDate' para 'depositedDate'
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
}
