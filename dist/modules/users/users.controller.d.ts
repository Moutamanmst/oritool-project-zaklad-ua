import { UsersService } from './users.service';
import { UpdateUserProfileDto, UpdateBusinessProfileDto, AdminUpdateUserDto } from './dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(page?: number, limit?: number): Promise<import("../../common/interfaces").PaginatedResult<any>>;
    getProfile(userId: string): Promise<any>;
    updateProfile(userId: string, dto: UpdateUserProfileDto): Promise<any>;
    updateBusinessProfile(userId: string, dto: UpdateBusinessProfileDto): Promise<any>;
    findOne(id: string): Promise<any>;
    adminUpdate(id: string, dto: AdminUpdateUserDto): Promise<any>;
    verifyBusiness(id: string): Promise<any>;
    delete(id: string): Promise<{
        message: string;
    }>;
}
