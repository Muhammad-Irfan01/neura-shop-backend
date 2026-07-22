import { Controller, Get, Post, Put, Body, Param, UseGuards, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  createOrder(@Request() req: { user: { userId: string } }, @Body() dto: CreateOrderDto) {
    return this.ordersService.createOrder(req.user.userId, dto);
  }

  @Get()
  findAll(@Request() req: { user: { userId: string } }) {
    return this.ordersService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Request() req: { user: { userId: string } }, @Param('id') id: string) {
    return this.ordersService.findOne(req.user.userId, id);
  }

  @Get('tracking/:id')
  trackOrder(@Param('id') id: string) {
    return this.ordersService.trackOrder(id);
  }

  @Put(':id/cancel')
  cancelOrder(@Request() req: { user: { userId: string } }, @Param('id') id: string) {
    return this.ordersService.cancelOrder(req.user.userId, id);
  }

  @Post(':id/return')
  returnOrder(@Request() req: { user: { userId: string } }, @Param('id') id: string) {
    return this.ordersService.returnOrder(req.user.userId, id);
  }

  @Get('invoice/:id')
  getInvoice(@Request() req: { user: { userId: string } }, @Param('id') id: string) {
    return this.ordersService.getInvoice(req.user.userId, id);
  }

  @Put(':id/status')
  updateStatus(@Request() req: { user: { userId: string } }, @Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(req.user.userId, id, dto);
  }
}
