import { UserRole } from '@prisma/client';
export declare class UserResponseDto {
    id: string;
    email: string;
    role: UserRole;
    isVerified: boolean;
    createdAt: Date;
}
export declare class AuthResponseDto {
    accessToken: string;
    user: UserResponseDto;
}
