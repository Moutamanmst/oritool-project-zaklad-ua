import { PrismaService } from '../../prisma/prisma.service';
interface CreateAILogDto {
    question: string;
    response: string;
    category?: string;
    userId?: string;
    sessionId: string;
    responseTime: number;
    tokens?: number;
    model?: string;
    userAgent?: string;
    ipAddress?: string;
}
interface AILogsFilter {
    category?: string;
    dateFrom?: Date;
    dateTo?: Date;
    helpful?: boolean;
    search?: string;
    page?: number;
    limit?: number;
}
export declare class AILogsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: CreateAILogDto): Promise<{
        category: string | null;
        id: string;
        createdAt: Date;
        userId: string | null;
        question: string;
        response: string;
        sessionId: string;
        responseTime: number;
        helpful: boolean | null;
        tokens: number;
        model: string;
        userAgent: string | null;
        ipAddress: string | null;
    }>;
    findAll(filter: AILogsFilter): Promise<{
        data: ({
            user: {
                email: string;
                id: string;
                profile: {
                    firstName: string | null;
                    lastName: string | null;
                } | null;
            } | null;
        } & {
            category: string | null;
            id: string;
            createdAt: Date;
            userId: string | null;
            question: string;
            response: string;
            sessionId: string;
            responseTime: number;
            helpful: boolean | null;
            tokens: number;
            model: string;
            userAgent: string | null;
            ipAddress: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getStats(): Promise<{
        totalQueries: number;
        todayQueries: number;
        weekQueries: number;
        monthQueries: number;
        avgResponseTime: number;
        helpfulRate: number;
        helpfulCount: number;
        notHelpfulCount: number;
        topCategories: {
            name: string;
            count: number;
        }[];
        hourlyDistribution: {};
        avgPerDay: number;
    }>;
    updateHelpful(id: string, helpful: boolean): Promise<{
        category: string | null;
        id: string;
        createdAt: Date;
        userId: string | null;
        question: string;
        response: string;
        sessionId: string;
        responseTime: number;
        helpful: boolean | null;
        tokens: number;
        model: string;
        userAgent: string | null;
        ipAddress: string | null;
    }>;
    getCategories(): Promise<{
        name: string;
        count: number;
    }[]>;
    private categorizeQuestion;
}
export {};
