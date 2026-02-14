import { PrismaService } from '../../prisma/prisma.service';
export declare class CategoriesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(lang?: string): Promise<any[]>;
    findOne(idOrSlug: string, lang?: string): Promise<any>;
    create(data: {
        slug: string;
        name: string;
        nameRu?: string;
        description?: string;
        descriptionRu?: string;
        icon?: string;
        parentId?: string;
        order?: number;
    }): Promise<{
        description: string | null;
        descriptionRu: string | null;
        id: string;
        createdAt: Date;
        isActive: boolean;
        updatedAt: Date;
        name: string;
        nameRu: string | null;
        slug: string;
        order: number;
        icon: string | null;
        parentId: string | null;
    }>;
    update(id: string, data: {
        name?: string;
        nameRu?: string;
        description?: string;
        descriptionRu?: string;
        icon?: string;
        order?: number;
        isActive?: boolean;
    }): Promise<{
        description: string | null;
        descriptionRu: string | null;
        id: string;
        createdAt: Date;
        isActive: boolean;
        updatedAt: Date;
        name: string;
        nameRu: string | null;
        slug: string;
        order: number;
        icon: string | null;
        parentId: string | null;
    }>;
    delete(id: string): Promise<{
        message: string;
    }>;
    private transformWithLang;
}
