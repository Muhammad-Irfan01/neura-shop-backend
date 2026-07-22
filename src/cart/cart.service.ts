import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddItemDto } from './dto/add-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ApplyCouponDto } from './dto/apply-coupon.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getCart(userId: string) {
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: {
          userId,
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
        },
        include: { items: { include: { product: true } } },
      });
    }
    return cart;
  }

  async addItem(userId: string, dto: AddItemDto) {
    const cart = await this.getCart(userId);
    const product = await this.prisma.product.findUnique({ where: { id: dto.productId } });
    if (!product) throw new NotFoundException('Product not found');

    const existingItem = cart.items.find(item => item.productId === dto.productId && item.variantId === dto.variantId);
    
    let result;
    if (existingItem) {
      result = await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { 
          quantity: existingItem.quantity + dto.quantity,
          total: (existingItem.quantity + dto.quantity) * product.price
        }
      });
    } else {
      result = await this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: dto.productId,
          variantId: dto.variantId,
          quantity: dto.quantity,
          price: product.price,
          total: dto.quantity * product.price
        }
      });
    }
    await this.updateCartTotals(cart.id);
    return result;
  }

  async updateItem(userId: string, itemId: string, dto: UpdateItemDto) {
    const cart = await this.getCart(userId);
    const item = cart.items.find(i => i.id === itemId);
    if (!item) throw new NotFoundException('Item not found in cart');

    const updatedItem = await this.prisma.cartItem.update({
      where: { id: itemId },
      data: { 
        quantity: dto.quantity,
        total: dto.quantity * item.price
      }
    });
    await this.updateCartTotals(cart.id);
    return updatedItem;
  }

  async removeItem(userId: string, itemId: string) {
    const cart = await this.getCart(userId);
    const item = cart.items.find(i => i.id === itemId);
    if (!item) throw new NotFoundException('Item not found in cart');

    await this.prisma.cartItem.delete({ where: { id: itemId } });
    await this.updateCartTotals(cart.id);
    return { message: 'Item removed' };
  }

  async clearCart(userId: string) {
    const cart = await this.getCart(userId);
    await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    await this.updateCartTotals(cart.id);
    return { message: 'Cart cleared' };
  }

  async applyCoupon(userId: string, dto: ApplyCouponDto) {
    const cart = await this.getCart(userId);
    // Basic implementation
    await this.prisma.cart.update({
      where: { id: cart.id },
      data: { couponCode: dto.couponCode }
    });
    await this.updateCartTotals(cart.id);
    return { message: 'Coupon applied' };
  }

  async removeCoupon(userId: string) {
    const cart = await this.getCart(userId);
    await this.prisma.cart.update({
      where: { id: cart.id },
      data: { couponCode: null }
    });
    await this.updateCartTotals(cart.id);
    return { message: 'Coupon removed' };
  }

  async getCartTotal(userId: string) {
    const cart = await this.getCart(userId);
    return { 
        total: cart.total,
        subtotal: cart.subtotal,
        discount: cart.discount,
        tax: cart.tax,
        shipping: cart.shipping
    };
  }

  private async updateCartTotals(cartId: string) {
      const items = await this.prisma.cartItem.findMany({ where: { cartId } });
      const subtotal = items.reduce((sum, item) => sum + item.total, 0);
      // Simplify logic for demo
      const tax = subtotal * 0.1;
      const shipping = subtotal > 100 ? 0 : 10;
      const total = subtotal + tax + shipping;
      
      await this.prisma.cart.update({
          where: { id: cartId },
          data: { subtotal, tax, shipping, total }
      });
  }
}
