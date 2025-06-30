import { FileProcessingStrategy } from './interfaces/file-processing.strategy';
import { OfxStrategy } from './strategies/ofx.strategy';
import { PdfStrategy } from './strategies/pdf.strategy';

export class FilesFactory {
  static getStrategy(fileType: string): FileProcessingStrategy {
    switch (fileType) {
      case 'pdf':
        return new PdfStrategy();
      case 'ofx':
        return new OfxStrategy();
      default:
        throw new Error(`Unsupported file type ${fileType}`);
    }
  }
}
