import { AuthService } from './auth.service';
import { RegisterDto, RegisterBusinessDto, LoginDto, AuthResponseDto } from './dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<AuthResponseDto>;
    registerBusiness(dto: RegisterBusinessDto): Promise<AuthResponseDto>;
    login(dto: LoginDto): Promise<AuthResponseDto>;
    getMe(user: any): Promise<any>;
}
