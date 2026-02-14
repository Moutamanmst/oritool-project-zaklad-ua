export declare class UploadController {
    uploadFile(file: Express.Multer.File): {
        url: string;
        filename: string;
        originalName: string;
        size: number;
        mimetype: string;
    };
}
