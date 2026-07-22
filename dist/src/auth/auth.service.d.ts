import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        id: string;
        email: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
    }>;
    logout(userId: string): Promise<{
        message: string;
    }>;
    refreshToken(refreshTokenDto: RefreshTokenDto): Promise<{
        message: string;
    }>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    verifyEmail(token: string): Promise<{
        message: string;
    }>;
    getMe(userId: string): Promise<{
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        id: string;
        avatar: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        lastLogin: Date | null;
        isActive: boolean;
        emailVerified: boolean;
        resetToken: string | null;
        resetTokenExpiry: Date | null;
    } | null>;
}
