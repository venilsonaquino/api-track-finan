import { Ofx } from "ofx-data-extractor";
import { FileProcessingStrategy } from "../interfaces/file-processing.strategy";
import { InternalServerErrorException, UnprocessableEntityException } from "@nestjs/common";
import { STRTTRN } from "ofx-data-extractor/dist/@types/ofx";
import { FileDto } from "../dto/file.dto";

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
      const bankTransferList = ofx.getBankTransferList();

      const fileDto: FileDto[] = bankTransferList.map((transfer: STRTTRN) => {
        return {
          transfer_type: transfer.TRNTYPE,
          diposted_date: typeof transfer.DTPOSTED == 'string' ? transfer.DTPOSTED : transfer.DTPOSTED.date,
          description: transfer.MEMO,
          amount: transfer.TRNAMT,
          fit_id: typeof transfer.FITID === 'string' ? transfer.FITID : transfer.FITID.transactionCode,
        };
      });

      return fileDto
    } catch (error) {
      throw new InternalServerErrorException(`Error when trying to parse data from the OFX file`)
    }

  }
}