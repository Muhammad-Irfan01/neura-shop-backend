import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  getProfile(@Request() req: any) {
    return this.usersService.getProfile(req.user.userId);
  }

  @Put('profile')
  updateProfile(@Request() req: any, @Body() updateProfileDto: UpdateProfileDto) {
    return this.usersService.updateProfile(req.user.userId, updateProfileDto);
  }

  @Put('password')
  updatePassword(@Request() req: any, @Body() updatePasswordDto: UpdatePasswordDto) {
    return this.usersService.updatePassword(req.user.userId, updatePasswordDto);
  }

  @Post('avatar')
  updateAvatar(@Request() req: any, @Body('url') avatarUrl: string) {
    return this.usersService.updateAvatar(req.user.userId, avatarUrl);
  }

  @Get('preferences')
  getPreferences(@Request() req: any) {
    return this.usersService.getPreferences(req.user.userId);
  }

  @Put('preferences')
  updatePreferences(@Request() req: any, @Body() updatePreferencesDto: UpdatePreferencesDto) {
    return this.usersService.updatePreferences(req.user.userId, updatePreferencesDto);
  }

  @Get('addresses')
  getAddresses(@Request() req: any) {
    return this.usersService.getAddresses(req.user.userId);
  }

  @Post('addresses')
  createAddress(@Request() req: any, @Body() createAddressDto: CreateAddressDto) {
    return this.usersService.createAddress(req.user.userId, createAddressDto);
  }

  @Put('addresses/:id')
  updateAddress(@Request() req: any, @Param('id') id: string, @Body() updateAddressDto: UpdateAddressDto) {
    return this.usersService.updateAddress(req.user.userId, id, updateAddressDto);
  }

  @Delete('addresses/:id')
  deleteAddress(@Request() req: any, @Param('id') id: string) {
    return this.usersService.deleteAddress(req.user.userId, id);
  }
}
