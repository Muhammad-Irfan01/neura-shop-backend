import { Controller, Get, Post, Body, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TrackEventDto } from './dto/track-event.dto';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('track')
  track(@Request() req: any, @Body() trackEventDto: TrackEventDto) {
    return this.analyticsService.track(req.user.userId, trackEventDto, req.ip, req.headers['user-agent']);
  }

  @Get('dashboard')
  async getDashboard(@Request() req: { user: { userId: string } }) {
    await this.analyticsService.checkAdmin(req.user.userId);
    return this.analyticsService.getDashboard();
  }

  @Get('sales')
  async getSales(@Request() req: { user: { userId: string } }) {
    await this.analyticsService.checkAdmin(req.user.userId);
    return this.analyticsService.getSales();
  }

  @Get('products')
  async getProducts(@Request() req: { user: { userId: string } }) {
    await this.analyticsService.checkAdmin(req.user.userId);
    return this.analyticsService.getProducts();
  }
}
