import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: { preferences: true, addresses: true },
    });
  }

  async updateProfile(userId: string, data: UpdateProfileDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data,
    });
  }

  async updatePassword(userId: string, data: UpdatePasswordDto) {
    // Note: In a production application, you must verify the old password 
    // by comparing hashed versions before updating to a new password.
    return this.prisma.user.update({
      where: { id: userId },
      data: { password: data.newPassword }, 
    });
  }

  async updateAvatar(userId: string, avatarUrl: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { avatar: avatarUrl },
    });
  }

  async getPreferences(userId: string) {
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

  async updatePreferences(userId: string, data: UpdatePreferencesDto) {
    return this.prisma.userPreference.upsert({
      where: { userId },
      update: data,
      create: { userId, ...data },
    });
  }

  async getAddresses(userId: string) {
    return this.prisma.address.findMany({
      where: { userId },
    });
  }

  async createAddress(userId: string, data: CreateAddressDto) {
    return this.prisma.address.create({
      data: { ...data, userId },
    });
  }

  async updateAddress(userId: string, addressId: string, data: UpdateAddressDto) {
    return this.prisma.address.update({
      where: { id: addressId, userId },
      data,
    });
  }

  async deleteAddress(userId: string, addressId: string) {
    return this.prisma.address.delete({
      where: { id: addressId, userId },
    });
  }
}
