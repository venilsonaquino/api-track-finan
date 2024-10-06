import { UnsupportedMediaTypeException } from "@nestjs/common";
import { ulid } from "ulid";

export class FileEntity {
  id: string;
  fileName: string;
  userId: string;
  uploadDate: string;
  extension: string;
  private VALID_EXTENSIONS = ['.ofx', '.pdf'];

  constructor(params: Partial<{
    id: string;
    fileName: string;
    userId: string;
    uploadDate: string;
    extension: string;
  }>) {
    this.id = params.id || ulid();
    this.fileName = params.fileName;
    this.userId = params.userId;
    this.uploadDate = new Date().toDateString();
    this.extension = this.getFileExtension(this.fileName);
    this.validateFile(this.fileName);
  }

  private validateFile(fileName: string) {
    const extension = fileName.split('.').pop()?.toLowerCase();

    if (!this.VALID_EXTENSIONS.includes(`.${extension}`)) {
      throw new UnsupportedMediaTypeException(`Unsupported file type: .${extension}. Supported types are: ${this.VALID_EXTENSIONS.join(', ')}`);
    }
  }

  private getFileExtension(fileName: string): string {
    return fileName.split('.').pop()?.toLowerCase() || '';
  }

  public getFileType(): string {
    return this.getFileExtension(this.fileName);
  }
}
