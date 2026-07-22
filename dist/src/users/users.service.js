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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getProfile(userId) {
        return this.prisma.user.findUnique({
            where: { id: userId },
            include: { preferences: true, addresses: true },
        });
    }
    async updateProfile(userId, data) {
        return this.prisma.user.update({
            where: { id: userId },
            data,
        });
    }
    async updatePassword(userId, data) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { password: data.newPassword },
        });
    }
    async updateAvatar(userId, avatarUrl) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { avatar: avatarUrl },
        });
    }
    async getPreferences(userId) {
        const prefs = await this.prisma.userPreference.findUnique({
            where: { userId },
        });
        if (!prefs) {
            return this.prisma.userPreference.create({
                data: { userId },
            });
        }
        return prefs;
    }
    async updatePreferences(userId, data) {
        return this.prisma.userPreference.upsert({
            where: { userId },
            update: data,
            create: { userId, ...data },
        });
    }
    async getAddresses(userId) {
        return this.prisma.address.findMany({
            where: { userId },
        });
    }
    async createAddress(userId, data) {
        return this.prisma.address.create({
            data: { ...data, userId },
        });
    }
    async updateAddress(userId, addressId, data) {
        return this.prisma.address.update({
            where: { id: addressId, userId },
            data,
        });
    }
    async deleteAddress(userId, addressId) {
        return this.prisma.address.delete({
            where: { id: addressId, userId },
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map