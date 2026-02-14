import { SiteContentService } from './site-content.service';
export declare class SiteContentController {
    private readonly siteContentService;
    constructor(siteContentService: SiteContentService);
    getAllContent(): Promise<Record<string, any>>;
    getContent(key: string): Promise<string | number | true | import("@prisma/client/runtime/library").JsonObject | import("@prisma/client/runtime/library").JsonArray | null>;
    upsertContent(key: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        data: import("@prisma/client/runtime/library").JsonValue;
        key: string;
    }>;
    deleteContent(key: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        data: import("@prisma/client/runtime/library").JsonValue;
        key: string;
    }>;
}
