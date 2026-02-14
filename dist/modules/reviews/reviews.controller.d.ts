import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UserRole, ReviewStatus } from '@prisma/client';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    findByEstablishment(id: string, page?: number, limit?: number): Promise<import("../../common/interfaces").PaginatedResult<any>>;
    findByPosSystem(id: string, page?: number, limit?: number): Promise<import("../../common/interfaces").PaginatedResult<any>>;
    findPending(page?: number, limit?: number): Promise<import("../../common/interfaces").PaginatedResult<any>>;
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
    respond(id: string, userId: string, content: string): Promise<{
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
}
