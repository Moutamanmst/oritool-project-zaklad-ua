import { EntityStatus } from '@prisma/client';
export declare class CreatePosSystemDto {
    name: string;
    nameRu?: string;
    description?: string;
    descriptionRu?: string;
    shortDescription?: string;
    shortDescriptionRu?: string;
    logoUrl?: string;
    coverUrl?: string;
    website?: string;
    priceFrom?: number;
    priceTo?: number;
    pricingModel?: string;
    features?: string[];
    integrations?: string[];
    categoryId?: string;
    status?: EntityStatus;
    isFeatured?: boolean;
}
