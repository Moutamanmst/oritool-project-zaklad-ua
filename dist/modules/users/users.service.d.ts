import { PrismaService } from '../../prisma/prisma.service';
import { UpdateUserProfileDto, UpdateBusinessProfileDto, AdminUpdateUserDto } from './dto';
import { PaginationParams, PaginatedResult } from '../../common/interfaces/pagination.interface';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(params: PaginationParams): Promise<PaginatedResult<any>>;
    findOne(id: string): Promise<any>;
    updateProfile(userId: string, dto: UpdateUserProfileDto): Promise<any>;
    updateBusinessProfile(userId: string, dto: UpdateBusinessProfileDto): Promise<any>;
    adminUpdate(userId: string, dto: AdminUpdateUserDto): Promise<any>;
    verifyBusiness(userId: string): Promise<any>;
    delete(userId: string): Promise<{
        message: string;
    }>;
    private sanitizeUser;
}
