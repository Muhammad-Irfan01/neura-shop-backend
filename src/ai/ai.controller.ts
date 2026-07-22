import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('chat')
  async chat(@Body() body: { sessionId: string; message: string }) {
    return this.aiService.chat(body.sessionId, body.message);
  }

  @Post('chat/new-session')
  async newSession() {
    return this.aiService.newSession();
  }

  @Get('chat/sessions')
  async getSessions() {
    return this.aiService.getSessions();
  }

  @Get('chat/:sessionId')
  async getSession(@Param('sessionId') sessionId: string) {
    return this.aiService.getSession(sessionId);
  }

  @Post('recommendations')
  async getRecommendations(@Body() body: { userId: string }) {
    return this.aiService.getRecommendations(body.userId);
  }

  @Post('search')
  async search(@Body() body: { query: string }) {
    return this.aiService.search(body.query);
  }

  @Post('analyze-review')
  async analyzeReview(@Body() body: { reviewId: string }) {
    return this.aiService.analyzeReview(body.reviewId);
  }

  @Post('sentiment')
  async getSentiment(@Body() body: { text: string }) {
    return this.aiService.getSentiment(body.text);
  }
}
