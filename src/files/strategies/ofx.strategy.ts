import { Ofx } from "ofx-data-extractor";
import { FileProcessingStrategy } from "../interfaces/file-processing.strategy";
import { InternalServerErrorException, UnprocessableEntityException } from "@nestjs/common";
import { OfxStructure } from "ofx-data-extractor/dist/@types/ofx";
import { FileDto } from "../dto/file.dto";

// Definindo os tipos que faltam
interface STRTTRN {
  TRNTYPE: string;
  DTPOSTED: string | { date: string };
  TRNAMT: number;
  FITID: string | { transactionCode: string };
  MEMO?: string;
  CHECKNUM?: string;
}

interface Bank {
  STMTTRNRS?: {
    STMTRS?: {
      BANKTRANLIST?: {
        STRTTRN?: STRTTRN[];
      };
      BANKACCTFROM?: {
        ACCTID: string;
        ACCTT?: string;
      };
      LEDGERBAL?: {
        BALAMT: number;
        DTASOF: string | { date: string };
      };
      CURDEF?: string;
    };
  };
}

interface CreditCard {
  CCSTMTTRNRS?: {
    CCSTMTRS?: {
      BANKTRANLIST?: {
        STRTTRN?: STRTTRN[];
      };
      CCACCTFROM?: {
        ACCTID: string;
      };
      LEDGERBAL?: {
        BALAMT: number;
        DTASOF: string | { date: string };
      };
      CURDEF?: string;
    };
  };
}

export class OfxStrategy implements FileProcessingStrategy {
  parse(file: Express.Multer.File): FileDto[] {
    const fileContent = file.buffer.toString('utf-8');
    const ofx = new Ofx(fileContent);

    try {
      const ofxStructure = ofx.getContent() as OfxStructure;
      
      const hasBankTransactions = ofxStructure.OFX.BANKMSGSRSV1 !== undefined;
      const hasCreditCardTransactions = ofxStructure.OFX.CREDITCARDMSGSRSV1 !== undefined;
      
      if (!hasBankTransactions && !hasCreditCardTransactions) {
        throw new UnprocessableEntityException('No Transactions found in OFX file');
      }
      
      // Obter informações do banco
      const bankInfo = this.extractBankInfo(ofxStructure);
      
      // Processar todas as transações
      const allTransactions = this.processAllTransactions(ofxStructure, bankInfo);
      
      if (allTransactions.length === 0) {
        throw new UnprocessableEntityException('No Transactions found in OFX file');
      }
      
      return allTransactions;
    } catch (error) {
      throw new InternalServerErrorException(`Error processing data from OFX file: ${error.message}`);
    }
  }
  
  /**
   * Extrai informações do banco do arquivo OFX
   */
  private extractBankInfo(ofxStructure: OfxStructure): {
    bankName: string;
    bankId: string;
    currency: string;
  } {
    const fi = ofxStructure.OFX.SIGNONMSGSRSV1.SONRS.FI;
    
    // Determinar a moeda (padrão: BRL)
    let currency = 'BRL';
    
    // Tentar obter a moeda do banco ou cartão de crédito
    if (ofxStructure.OFX.BANKMSGSRSV1 && ofxStructure.OFX.BANKMSGSRSV1.STMTTRNRS && ofxStructure.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS) {
      currency = ofxStructure.OFX.BANKMSGSRSV1.STMTTRS.CURDEF || currency;
    } else if (ofxStructure.OFX.CREDITCARDMSGSRSV1 && ofxStructure.OFX.CREDITCARDMSGSRSV1.CCSTMTTRNRS && ofxStructure.OFX.CREDITCARDMSGSRSV1.CCSTMTTRNRS.CCSTMTRS) {
      currency = ofxStructure.OFX.CREDITCARDMSGSRSV1.CCSTMTTRS.CURDEF || currency;
    }
    
    return {
      bankName: fi.ORG || 'Desconhecido',
      bankId: fi.FID || 'Desconhecido',
      currency
    };
  }
  
  /**
   * Processa todas as transações (débito e cartão de crédito) do arquivo OFX
   */
  private processAllTransactions(ofxStructure: OfxStructure, bankInfo: { bankName: string; bankId: string; currency: string }): FileDto[] {
    let allTransactions: FileDto[] = [];
    
    // Processar transações de débito
    if (ofxStructure.OFX.BANKMSGSRSV1) {
      const bankTransactions = this.processDebitTransactions(ofxStructure.OFX.BANKMSGSRSV1, bankInfo);
      allTransactions = [...allTransactions, ...bankTransactions];
    }
    
    // Processar transações de cartão de crédito
    if (ofxStructure.OFX.CREDITCARDMSGSRSV1) {
      const creditCardTransactions = this.processCreditCardTransactions(ofxStructure.OFX.CREDITCARDMSGSRSV1, bankInfo);
      allTransactions = [...allTransactions, ...creditCardTransactions];
    }
    
    return allTransactions;
  }
  
  /**
   * Processa transações de débito
   */
  private processDebitTransactions(bankData: Bank, bankInfo: { bankName: string; bankId: string; currency: string }): FileDto[] {
    const transactions: FileDto[] = [];
    
    if (bankData.STMTTRNRS && bankData.STMTTRNRS.STMTRS && bankData.STMTTRNRS.STMTRS.BANKTRANLIST) {
      const bankTransferList = bankData.STMTTRNRS.STMTRS.BANKTRANLIST;
      const accountInfo = bankData.STMTTRNRS.STMTRS.BANKACCTFROM;
      const ledgerBal = bankData.STMTTRNRS.STMTRS.LEDGERBAL;
      
      if (bankTransferList.STRTTRN && Array.isArray(bankTransferList.STRTTRN)) {
        return bankTransferList.STRTTRN.map(transfer => 
          this.createTransactionDto(
            transfer, 
            'BANK', 
            bankInfo,
            accountInfo ? {
              accountId: accountInfo.ACCTID,
              accountType: accountInfo.ACCTT
            } : undefined,
            ledgerBal
          )
        );
      }
    }
    
    return transactions;
  }
  
  /**
   * Processa transações de cartão de crédito
   */
  private processCreditCardTransactions(creditCardData: CreditCard, bankInfo: { bankName: string; bankId: string; currency: string }): FileDto[] {
    const transactions: FileDto[] = [];
    
    if (creditCardData.CCSTMTTRNRS && creditCardData.CCSTMTTRNRS.CCSTMTRS && creditCardData.CCSTMTTRNRS.CCSTMTRS.BANKTRANLIST) {
      const bankTransferList = creditCardData.CCSTMTTRNRS.CCSTMTRS.BANKTRANLIST;
      const accountInfo = creditCardData.CCSTMTTRNRS.CCSTMTRS.CCACCTFROM;
      const ledgerBal = creditCardData.CCSTMTTRNRS.CCSTMTRS.LEDGERBAL;
      
      if (bankTransferList.STRTTRN && Array.isArray(bankTransferList.STRTTRN)) {
        return bankTransferList.STRTTRN.map(transfer => 
          this.createTransactionDto(
            transfer, 
            'CREDIT_CARD', 
            bankInfo,
            accountInfo ? {
              accountId: accountInfo.ACCTID,
              accountType: 'CREDIT_CARD'
            } : undefined,
            ledgerBal
          )
        );
      }
    }
    
    return transactions;
  }
  
  /**
   * Cria um objeto FileDto a partir de uma transação
   */
  private createTransactionDto(
    transfer: STRTTRN, 
    source: 'BANK' | 'CREDIT_CARD',
    bankInfo: { bankName: string; bankId: string; currency: string },
    accountInfo?: { accountId: string; accountType: string },
    ledgerBal?: { BALAMT: number; DTASOF: any }
  ): FileDto {
    return {
      transferType: transfer.TRNTYPE,
      depositedDate: typeof transfer.DTPOSTED == 'string' ? transfer.DTPOSTED : transfer.DTPOSTED.date,
      description: transfer.MEMO || '',
      amount: transfer.TRNAMT.toString(),
      fitId: typeof transfer.FITID === 'string' ? transfer.FITID : transfer.FITID.transactionCode,
      category: null,
      isRecurring: null,
      recurringMonths: null,
      wallet: null,
      isFitIdAlreadyExists: false,
      bankName: bankInfo.bankName,
      bankId: bankInfo.bankId,
      accountId: accountInfo?.accountId,
      accountType: accountInfo?.accountType,
      currency: bankInfo.currency,
      transactionDate: typeof transfer.DTPOSTED == 'string' ? transfer.DTPOSTED : transfer.DTPOSTED.date,
      checkNumber: transfer.CHECKNUM,
      transactionSource: source,
      balance: ledgerBal?.BALAMT.toString(),
      balanceDate: ledgerBal?.DTASOF ? (typeof ledgerBal.DTASOF == 'string' ? ledgerBal.DTASOF : ledgerBal.DTASOF.date) : undefined
    };
  }
}