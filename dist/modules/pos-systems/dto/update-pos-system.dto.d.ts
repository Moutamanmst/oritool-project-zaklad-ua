import { CreatePosSystemDto } from './create-pos-system.dto';
import { EntityStatus } from '@prisma/client';
declare const UpdatePosSystemDto_base: import("@nestjs/common").Type<Partial<CreatePosSystemDto>>;
export declare class UpdatePosSystemDto extends UpdatePosSystemDto_base {
    status?: EntityStatus;
    isFeatured?: boolean;
}
export declare class AdminUpdatePosSystemDto extends UpdatePosSystemDto {
}
export {};
