import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../prisma/prisma.service';
interface JwtPayload {
    sub: string;
    email: string;
    role: string;
}
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private prisma;
    constructor(prisma: PrismaService, configService: ConfigService);
    validate(payload: JwtPayload): Promise<{
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.UserRole;
        isVerified: boolean;
        profile: {
            city: string | null;
            firstName: string | null;
            lastName: string | null;
            phone: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            avatarUrl: string | null;
            userId: string;
        } | null;
        businessProfile: {
            description: string | null;
            email: string | null;
            phone: string | null;
            companyName: string;
            companyNameRu: string | null;
            descriptionRu: string | null;
            website: string | null;
            id: string;
            isVerified: boolean;
            createdAt: Date;
            updatedAt: Date;
            logoUrl: string | null;
            verifiedAt: Date | null;
            userId: string;
        } | null;
    }>;
}
export {};
