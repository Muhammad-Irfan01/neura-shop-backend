import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddItemDto } from './dto/add-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ApplyCouponDto } from './dto/apply-coupon.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@Request() req: { user: { userId: string } }) {
    return this.cartService.getCart(req.user.userId);
  }

  @Post('items')
  addItem(@Request() req: { user: { userId: string } }, @Body() dto: AddItemDto) {
    return this.cartService.addItem(req.user.userId, dto);
  }

  @Put('items/:id')
  updateItem(@Request() req: { user: { userId: string } }, @Param('id') id: string, @Body() dto: UpdateItemDto) {
    return this.cartService.updateItem(req.user.userId, id, dto);
  }

  @Delete('items/:id')
  removeItem(@Request() req: { user: { userId: string } }, @Param('id') id: string) {
    return this.cartService.removeItem(req.user.userId, id);
  }

  @Delete()
  clearCart(@Request() req: { user: { userId: string } }) {
    return this.cartService.clearCart(req.user.userId);
  }

  @Post('apply-coupon')
  applyCoupon(@Request() req: { user: { userId: string } }, @Body() dto: ApplyCouponDto) {
    return this.cartService.applyCoupon(req.user.userId, dto);
  }

  @Delete('remove-coupon')
  removeCoupon(@Request() req: { user: { userId: string } }) {
    return this.cartService.removeCoupon(req.user.userId);
  }

  @Get('total')
  getCartTotal(@Request() req: { user: { userId: string } }) {
    return this.cartService.getCartTotal(req.user.userId);
  }
}
