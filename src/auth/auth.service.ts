import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { pbkdf2Sync, randomBytes, timingSafeEqual } from 'node:crypto';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

const SALT_LEN = 16;
const KEY_LEN = 64;

function hashPassword(password: string): string {
  const salt = randomBytes(SALT_LEN).toString('hex');
  const hash = pbkdf2Sync(password, salt, 10000, KEY_LEN, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':');
  const buffer = pbkdf2Sync(password, salt, 10000, KEY_LEN, 'sha512');
  const hashBuffer = Buffer.from(hash, 'hex');
  return timingSafeEqual(hashBuffer, buffer);
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, firstName, lastName } = registerDto;
    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) throw new BadRequestException('User already exists');

    const hashedPassword = hashPassword(password);
    const user = await this.prisma.user.create({
      data: { email, password: hashedPassword, firstName, lastName },
    });
    return { id: user.id, email: user.email };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !verifyPassword(password, user.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { sub: user.id, email: user.email };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async logout(userId: string) {
    // In a real app, you might blacklist the token in Redis
    return { message: 'Logged out' };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
      // Implement refresh token logic
      return { message: 'Not implemented' };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { email: forgotPasswordDto.email } });
    if (!user) throw new NotFoundException('User not found');
    
    const token = randomBytes(32).toString('hex');
    await this.prisma.user.update({
        where: { email: forgotPasswordDto.email },
        data: { resetToken: token, resetTokenExpiry: new Date(Date.now() + 3600000) }
    });
    return { message: 'Reset token sent' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const user = await this.prisma.user.findFirst({
        where: { resetToken: resetPasswordDto.token, resetTokenExpiry: { gt: new Date() } }
    });
    if (!user) throw new BadRequestException('Invalid or expired token');

    const hashedPassword = hashPassword(resetPasswordDto.password);
    await this.prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword, resetToken: null, resetTokenExpiry: null }
    });
    return { message: 'Password reset successful' };
  }

  async verifyEmail(token: string) {
    // Implement email verification
    return { message: 'Not implemented' };
  }

  async getMe(userId: string) {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }
}
