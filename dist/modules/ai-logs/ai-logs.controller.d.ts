import { AILogsService } from './ai-logs.service';
export declare class AILogsController {
    private readonly aiLogsService;
    constructor(aiLogsService: AILogsService);
    create(data: any): Promise<{
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
    findAll(category?: string, dateFrom?: string, dateTo?: string, helpful?: string, search?: string, page?: string, limit?: string): Promise<{
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
    getCategories(): Promise<{
        name: string;
        count: number;
    }[]>;
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
}
