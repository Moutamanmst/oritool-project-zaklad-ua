export declare class RegisterDto {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
}
export declare class RegisterBusinessDto extends RegisterDto {
    companyName: string;
    companyNameRu?: string;
    description?: string;
    descriptionRu?: string;
    website?: string;
}
