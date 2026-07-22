import { IsString, IsNotEmpty, IsObject, IsOptional } from 'class-validator';

export class CreateOrderDto {
  @IsObject()
  @IsNotEmpty()
  shippingAddress: any;

  @IsObject()
  @IsOptional()
  billingAddress?: any;

  @IsString()
  @IsNotEmpty()
  paymentMethod: string;

  @IsString()
  @IsOptional()
  paymentId?: string;
}
