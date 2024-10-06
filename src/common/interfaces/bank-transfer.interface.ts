import { DateResponse } from "ofx-data-extractor";

export interface BankerTransferInterface {
  tranferType: string; 
  dipostedDate: string | DateResponse;
  transaction_amount: string; 
  fitId: string | {
      date: string;
      protocol: string;
      transactionCode: string;
  };
  checkNumber?: string;
  description: string;
}