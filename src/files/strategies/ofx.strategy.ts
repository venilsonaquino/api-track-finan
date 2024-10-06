import { Ofx } from "ofx-data-extractor";
import { FileProcessingStrategy } from "../interfaces/file-processing.strategy";
import { InternalServerErrorException, UnprocessableEntityException } from "@nestjs/common";

export class OfxStrategy implements FileProcessingStrategy {
  parse(file: Express.Multer.File): any {
    const fileContent = file.buffer.toString('utf-8');

    const ofx = new Ofx(fileContent)

    const bankTransactionListRegex = /<BANKTRANLIST>([\s\S]*?)<\/BANKTRANLIST>/;
    const stmtTrnRegex = /<STMTTRN>/;

    const bankTransactionListMatch = fileContent.match(bankTransactionListRegex);

    if (bankTransactionListMatch) {
      const bankTransactionListContent = bankTransactionListMatch[1];
      const hasStmtTrn = stmtTrnRegex.test(bankTransactionListContent);

      if (!hasStmtTrn) {
        throw new UnprocessableEntityException('No Transactions found in OFX file');
      }
    }

    try {
      const bankTransferList = ofx.getBankTransferList()

      // const bankTransfer: BankerTransferInterface[] = bankTransferList.map((transfer: STRTTRN) => {
      //   return {
      //       tranferType: transfer.TRNTYPE,
      //       dipostedDate: transfer.DTPOSTED,
      //       transaction_amount: transfer.TRNAMT,
      //       fitId: transfer.FITID,
      //       checkNumber: transfer.CHECKNUM,
      //       description: transfer.MEMO
      //   };
      // });

      return bankTransferList
    } catch (error) {
      throw new InternalServerErrorException(`Error when trying to parse data from the OFX file`)
    }

  }
}