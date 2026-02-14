import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto, RegisterBusinessDto, LoginDto, AuthResponseDto } from './dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    private configService;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService);
    register(dto: RegisterDto): Promise<AuthResponseDto>;
    registerBusiness(dto: RegisterBusinessDto): Promise<AuthResponseDto>;
    login(dto: LoginDto): Promise<AuthResponseDto>;
    validateUser(userId: string): Promise<{
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
    } & {
        email: string;
        password: string;
        id: string;
        role: import(".prisma/client").$Enums.UserRole;
        isVerified: boolean;
        createdAt: Date;
        isActive: boolean;
        updatedAt: Date;
    }>;
    private generateToken;
}
