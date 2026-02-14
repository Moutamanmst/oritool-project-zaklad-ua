export declare class FilterPosSystemDto {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    features?: string[];
    integrations?: string[];
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    lang?: string;
}
