import { PrismaService } from '../../prisma/prisma.service';
import { CreateRatingDto } from './dto/create-rating.dto';
export declare class RatingsService {
    private prisma;
    constructor(prisma: PrismaService);
    createOrUpdate(userId: string, dto: CreateRatingDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        establishmentId: string | null;
        posSystemId: string | null;
        score: number;
    }>;
    private rateEstablishment;
    private ratePosSystem;
    private updateEstablishmentAverageRating;
    private updatePosSystemAverageRating;
    getUserRating(userId: string, entityType: 'establishment' | 'posSystem', entityId: string): Promise<{
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
    getEntityRatingStats(entityType: 'establishment' | 'posSystem', entityId: string): Promise<{
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
