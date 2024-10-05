export interface FileProcessingStrategy {
    parse(file: Express.Multer.File): any;
}