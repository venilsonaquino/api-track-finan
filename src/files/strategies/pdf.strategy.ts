import { NotImplementedException } from '@nestjs/common';
import { FileProcessingStrategy } from '../interfaces/file-processing.strategy';

export class PdfStrategy implements FileProcessingStrategy {
  parse(file: Express.Multer.File): any {
    throw new NotImplementedException(file);
  }
}
