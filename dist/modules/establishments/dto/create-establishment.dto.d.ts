import { BusinessType } from '@prisma/client';
export declare class CreateEstablishmentDto {
    name: string;
    nameRu?: string;
    description?: string;
    descriptionRu?: string;
    businessType: BusinessType;
    address?: string;
    addressRu?: string;
    phone?: string;
    email?: string;
    website?: string;
    logoUrl?: string;
    coverUrl?: string;
    priceRange?: number;
    latitude?: number;
    longitude?: number;
    workingHours?: Record<string, {
        open: string;
        close: string;
    }>;
    features?: string[];
    categoryId?: string;
    cityId?: string;
}
