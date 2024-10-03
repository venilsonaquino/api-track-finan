import { ulid } from "ulid";

export class OfxFileEntity {
    id: string;
    userId: string;
    fileName: string;
    uploadDate: string;

    constructor(params: Partial<{
        id: string;
        userId: string;
        fileName: string;
        uploadDate: string;
    }>){
        this.id = params.id || ulid();
        this.userId = params.userId;
        this.fileName = params.fileName;
        this.uploadDate = params.uploadDate || new Date().toISOString()
    }
}
