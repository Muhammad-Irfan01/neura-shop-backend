import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CartService } from '../cart/cart.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService, private cartService: CartService) {}

  async createOrder(userId: string, dto: CreateOrderDto) {
    const cart = await this.cartService.getCart(userId);
    if (cart.items.length === 0) throw new NotFoundException('Cart is empty');

    const orderNumber = 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    const order = await this.prisma.order.create({
      data: {
        orderNumber,
        userId,
        subtotal: cart.subtotal,
        tax: cart.tax,
        shipping: cart.shipping,
        discount: cart.discount,
        total: cart.total,
        couponCode: cart.couponCode,
        shippingAddress: dto.shippingAddress,
        billingAddress: dto.billingAddress || dto.shippingAddress,
        paymentMethod: dto.paymentMethod,
        paymentId: dto.paymentId,
        items: {
          create: cart.items.map(item => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            price: item.price,
            total: item.total
          }))
        }
      }
    });

    await this.cartService.clearCart(userId);
    return order;
  }

  async findAll(userId: string) {
    return this.prisma.order.findMany({ where: { userId }, include: { items: true } });
  }

  async findOne(userId: string, id: string) {
    const order = await this.prisma.order.findUnique({ where: { id }, include: { items: true } });
    if (!order || order.userId !== userId) throw new NotFoundException('Order not found');
    return order;
  }

  async trackOrder(id: string) {
    const order = await this.prisma.order.findUnique({ where: { id }, select: { id: true, status: true, trackingNumber: true } });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async cancelOrder(userId: string, id: string) {
    const order = await this.findOne(userId, id);
    if (order.status !== 'PENDING') throw new ForbiddenException('Order cannot be cancelled');
    
    return this.prisma.order.update({
      where: { id },
      data: { status: 'CANCELLED', cancelledAt: new Date() }
    });
  }

  async returnOrder(userId: string, id: string) {
    const order = await this.findOne(userId, id);
    if (order.status !== 'DELIVERED') throw new ForbiddenException('Only delivered orders can be returned');
    
    return this.prisma.order.update({
      where: { id },
      data: { status: 'REFUNDED', refundedAt: new Date() }
    });
  }

  async getInvoice(userId: string, id: string) {
    const order = await this.findOne(userId, id);
    // Simple mock
    return { orderNumber: order.orderNumber, total: order.total, date: order.createdAt };
  }

  async updateStatus(userId: string, id: string, dto: UpdateOrderStatusDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.role !== 'ADMIN') throw new ForbiddenException('Only admins can update status');

    return this.prisma.order.update({
      where: { id },
      data: { status: dto.status }
    });
  }
}
