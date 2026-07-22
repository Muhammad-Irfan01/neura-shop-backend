import { IsArray, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class UpdatePreferencesDto {
  @IsOptional()
  @IsArray()
  preferredCategories?: string[];

  @IsOptional()
  @IsArray()
  preferredBrands?: string[];

  @IsOptional()
  @IsNumber()
  priceMin?: number;

  @IsOptional()
  @IsNumber()
  priceMax?: number;

  @IsOptional()
  @IsBoolean()
  notificationEmail?: boolean;

  @IsOptional()
  @IsBoolean()
  notificationSMS?: boolean;
}
