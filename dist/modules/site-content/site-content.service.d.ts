import { PrismaService } from '../../prisma/prisma.service';
export declare class SiteContentService {
    private prisma;
    constructor(prisma: PrismaService);
    getContent(key: string): Promise<string | number | true | import("@prisma/client/runtime/library").JsonObject | import("@prisma/client/runtime/library").JsonArray | null>;
    getAllContent(): Promise<Record<string, any>>;
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
