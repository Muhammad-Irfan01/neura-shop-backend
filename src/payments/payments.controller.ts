import { 
  Controller, 
  Post, 
  Get, 
  Body, 
  Req, 
  UseGuards, 
  Headers, 
  BadRequestException,
  type RawBodyRequest
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create-intent')
  async createIntent(@Body() createPaymentIntentDto: CreatePaymentIntentDto) {
    return this.paymentsService.createPaymentIntent(createPaymentIntentDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('confirm')
  async confirm(@Body('paymentIntentId') paymentIntentId: string) {
    return this.paymentsService.confirmPayment(paymentIntentId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('methods')
  async getMethods(@Req() req: any) {
    // Assuming user has a Stripe customer ID
    return this.paymentsService.getPaymentMethods(req.user.stripeCustomerId);
  }

  @Post('webhooks/stripe')
  async handleWebhook(
    @Headers('stripe-signature') sig: string,
    @Req() req: RawBodyRequest<Request>,
  ) {
    if (!sig) {
      throw new BadRequestException('Missing stripe-signature header');
    }

    const event = this.paymentsService.constructEvent(
      req.rawBody!, // Raw body is available because we configured it in main.ts
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    // Handle event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        // Handle success
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return { received: true };
  }
}
