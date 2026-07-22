import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TrackEventDto } from './dto/track-event.dto';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async checkAdmin(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.role !== 'ADMIN') {
      throw new ForbiddenException('Admin access required');
    }
  }

  async track(userId: string, trackEventDto: TrackEventDto, ip: string, userAgent: string) {
    return this.prisma.analytics.create({
      data: {
        event: trackEventDto.event,
        userId,
        sessionId: 'session-id',
        data: trackEventDto.data,
        ip,
        userAgent,
      },
    });
  }

  async getDashboard() {
    return {
      users: await this.prisma.user.count(),
      orders: await this.prisma.order.count(),
      products: await this.prisma.product.count(),
    };
  }

  async getSales() {
    return this.prisma.order.aggregate({
      _sum: { total: true },
    });
  }

  async getProducts() {
    return this.prisma.product.findMany({
      take: 10,
      orderBy: { reviewCount: 'desc' },
    });
  }
}
