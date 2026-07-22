"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const node_crypto_1 = require("node:crypto");
const SALT_LEN = 16;
const KEY_LEN = 64;
function hashPassword(password) {
    const salt = (0, node_crypto_1.randomBytes)(SALT_LEN).toString('hex');
    const hash = (0, node_crypto_1.pbkdf2Sync)(password, salt, 10000, KEY_LEN, 'sha512').toString('hex');
    return `${salt}:${hash}`;
}
function verifyPassword(password, stored) {
    const [salt, hash] = stored.split(':');
    const buffer = (0, node_crypto_1.pbkdf2Sync)(password, salt, 10000, KEY_LEN, 'sha512');
    const hashBuffer = Buffer.from(hash, 'hex');
    return (0, node_crypto_1.timingSafeEqual)(hashBuffer, buffer);
}
let AuthService = class AuthService {
    prisma;
    jwtService;
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async register(registerDto) {
        const { email, password, firstName, lastName } = registerDto;
        const existingUser = await this.prisma.user.findUnique({ where: { email } });
        if (existingUser)
            throw new common_1.BadRequestException('User already exists');
        const hashedPassword = hashPassword(password);
        const user = await this.prisma.user.create({
            data: { email, password: hashedPassword, firstName, lastName },
        });
        return { id: user.id, email: user.email };
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user || !verifyPassword(password, user.password)) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const payload = { sub: user.id, email: user.email };
        return {
            accessToken: this.jwtService.sign(payload),
        };
    }
    async logout(userId) {
        return { message: 'Logged out' };
    }
    async refreshToken(refreshTokenDto) {
        return { message: 'Not implemented' };
    }
    async forgotPassword(forgotPasswordDto) {
        const user = await this.prisma.user.findUnique({ where: { email: forgotPasswordDto.email } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const token = (0, node_crypto_1.randomBytes)(32).toString('hex');
        await this.prisma.user.update({
            where: { email: forgotPasswordDto.email },
            data: { resetToken: token, resetTokenExpiry: new Date(Date.now() + 3600000) }
        });
        return { message: 'Reset token sent' };
    }
    async resetPassword(resetPasswordDto) {
        const user = await this.prisma.user.findFirst({
            where: { resetToken: resetPasswordDto.token, resetTokenExpiry: { gt: new Date() } }
        });
        if (!user)
            throw new common_1.BadRequestException('Invalid or expired token');
        const hashedPassword = hashPassword(resetPasswordDto.password);
        await this.prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword, resetToken: null, resetTokenExpiry: null }
        });
        return { message: 'Password reset successful' };
    }
    async verifyEmail(token) {
        return { message: 'Not implemented' };
    }
    async getMe(userId) {
        return this.prisma.user.findUnique({ where: { id: userId } });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map