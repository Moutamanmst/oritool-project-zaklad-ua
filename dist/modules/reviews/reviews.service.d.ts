import { PrismaService } from '../../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewStatus, UserRole } from '@prisma/client';
import { PaginationParams, PaginatedResult } from '../../common/interfaces/pagination.interface';
export declare class ReviewsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, dto: CreateReviewDto): Promise<{
        user: {
            id: string;
            profile: {
                firstName: string | null;
                lastName: string | null;
                avatarUrl: string | null;
            } | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        userId: string;
        status: import(".prisma/client").$Enums.ReviewStatus;
        establishmentId: string | null;
        posSystemId: string | null;
        pros: string | null;
        cons: string | null;
        isVerifiedPurchase: boolean;
        helpfulCount: number;
    }>;
    findByEntity(entityType: 'establishment' | 'posSystem', entityId: string, params: PaginationParams): Promise<PaginatedResult<any>>;
    findPending(params: PaginationParams): Promise<PaginatedResult<any>>;
    moderate(id: string, status: ReviewStatus): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        userId: string;
        status: import(".prisma/client").$Enums.ReviewStatus;
        establishmentId: string | null;
        posSystemId: string | null;
        pros: string | null;
        cons: string | null;
        isVerifiedPurchase: boolean;
        helpfulCount: number;
    }>;
    respondToReview(reviewId: string, userId: string, content: string): Promise<{
        user: {
            businessProfile: {
                companyName: string;
                logoUrl: string | null;
            } | null;
            id: string;
            role: import(".prisma/client").$Enums.UserRole;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        userId: string;
        reviewId: string;
    }>;
    delete(id: string, userId: string, userRole: UserRole): Promise<{
        message: string;
    }>;
    private updateEntityReviewCount;
}
