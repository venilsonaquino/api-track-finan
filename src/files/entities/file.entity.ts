import { UnsupportedMediaTypeException } from "@nestjs/common";

export class FileEntity {

  private _file: Express.Multer.File;
  private VALID_EXTENSIONS = ['.ofx', '.pdf'];

  constructor(file: Express.Multer.File) {
    this._file = file;
    this.validateFile(file);
  }

  private validateFile(file: Express.Multer.File) {
    const extension = file.originalname.split('.').pop()?.toLowerCase();

    if (!this.VALID_EXTENSIONS.includes(`.${extension}`)) {
      throw new UnsupportedMediaTypeException(`Unsupported file type: .${extension}. Supported types are: ${this.VALID_EXTENSIONS.join(', ')}`);
    }
  }

  private getFileExtension(file: Express.Multer.File): string {
    return file.originalname.split('.').pop()?.toLowerCase() || '';
  }

  public getFileType(): string {
    return this.getFileExtension(this._file);
  }

  get file() {
    return this._file;
  }
}
