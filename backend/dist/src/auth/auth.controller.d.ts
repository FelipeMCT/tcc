import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(dto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: number;
            name: string;
            email: string;
            role: import("@prisma/client").$Enums.Role;
            points: number;
        };
    }>;
    me(user: {
        id: number;
        email: string;
        role: string;
    }): {
        id: number;
        email: string;
        role: string;
    };
    gestorOnly(): {
        message: string;
    };
    funcionarioOnly(): {
        message: string;
    };
}
