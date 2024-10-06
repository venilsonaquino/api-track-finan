import { BankerTransferInterface } from "src/common/interfaces/bank-transfer.interface";

export interface FileProcessingStrategy {
    parse(file: Express.Multer.File): BankerTransferInterface[];
}