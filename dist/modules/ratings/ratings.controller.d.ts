import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dto/create-rating.dto';
export declare class RatingsController {
    private readonly ratingsService;
    constructor(ratingsService: RatingsService);
    rate(userId: string, dto: CreateRatingDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        establishmentId: string | null;
        posSystemId: string | null;
        score: number;
    }>;
    getMyEstablishmentRating(userId: string, establishmentId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        establishmentId: string | null;
        posSystemId: string | null;
        score: number;
    } | {
        score: number;
    }>;
    getMyPosSystemRating(userId: string, posSystemId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        establishmentId: string | null;
        posSystemId: string | null;
        score: number;
    } | {
        score: number;
    }>;
    getEstablishmentStats(id: string): Promise<{
        averageRating: number;
        totalRatings: number;
        distribution: {
            1: number;
            2: number;
            3: number;
            4: number;
            5: number;
        };
    }>;
    getPosSystemStats(id: string): Promise<{
        averageRating: number;
        totalRatings: number;
        distribution: {
            1: number;
            2: number;
            3: number;
            4: number;
            5: number;
        };
    }>;
}
