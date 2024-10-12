import { FileDto } from "../dto/file.dto";

export interface FileProcessingStrategy {
    parse(file: Express.Multer.File): FileDto[];
}