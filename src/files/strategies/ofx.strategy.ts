import { FileProcessingStrategy } from "../interfaces/file-processing.strategy";

export class OfxStrategy implements FileProcessingStrategy {
  parse(file: Express.Multer.File): any {
    return { name: file.originalname, size: file.size };
  }
}