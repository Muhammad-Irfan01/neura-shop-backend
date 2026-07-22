import { Injectable, InternalServerErrorException } from '@nestjs/common';
import Stripe from 'stripe'; // This assumes 'stripe' is in dependencies
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor() {
    // In a real app, use ConfigService to get the API key
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
      apiVersion: '2026-06-24.dahlia',
    });
  }

  async createPaymentIntent(createPaymentIntentDto: CreatePaymentIntentDto) {
    try {
      return await this.stripe.paymentIntents.create({
        amount: createPaymentIntentDto.amount,
        currency: createPaymentIntentDto.currency,
        metadata: { orderId: createPaymentIntentDto.orderId },
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async confirmPayment(paymentIntentId: string) {
    return await this.stripe.paymentIntents.confirm(paymentIntentId);
  }

  async getPaymentMethods(customerId: string) {
    return await this.stripe.paymentMethods.list({
      customer: customerId,
      type: 'card',
    });
  }

  // Webhook handler
  constructEvent(body: Buffer, sig: string, endpointSecret: string) {
    return this.stripe.webhooks.constructEvent(body, sig, endpointSecret);
  }
}
