import { BusinessType, EntityStatus } from '@prisma/client';
export declare class FilterEstablishmentDto {
    page?: number;
    limit?: number;
    search?: string;
    businessType?: BusinessType;
    categoryId?: string;
    cityId?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    status?: EntityStatus;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    lang?: string;
}
