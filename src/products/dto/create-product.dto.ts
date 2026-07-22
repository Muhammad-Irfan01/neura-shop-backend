import { IsString, IsNotEmpty, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  price: number;

  @IsNumber()
  @IsOptional()
  comparePrice?: number;

  @IsString()
  @IsNotEmpty()
  sku: string;

  @IsNumber()
  stock: number;

  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @IsOptional()
  tags?: string[];
}
