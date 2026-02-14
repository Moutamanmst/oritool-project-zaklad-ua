import { CreateEstablishmentDto } from './create-establishment.dto';
import { EntityStatus } from '@prisma/client';
declare const UpdateEstablishmentDto_base: import("@nestjs/common").Type<Partial<CreateEstablishmentDto>>;
export declare class UpdateEstablishmentDto extends UpdateEstablishmentDto_base {
}
export declare class AdminUpdateEstablishmentDto extends UpdateEstablishmentDto {
    status?: EntityStatus;
    isFeatured?: boolean;
}
export {};
