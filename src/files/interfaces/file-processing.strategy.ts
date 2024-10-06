import { BankTransferType } from "src/common/types/bank-transfer.type";

export interface FileProcessingStrategy {
    parse(file: Express.Multer.File): BankTransferType[];
}