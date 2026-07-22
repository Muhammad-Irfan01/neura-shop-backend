import { Injectable } from '@nestjs/common';
import { Product } from '@prisma/client';

@Injectable()
export class ChunkingService {
  chunkProduct(product: Product): { type: string, content: string }[] {
    const chunks = [];
    chunks.push({ type: 'TITLE', content: product.name });
    chunks.push({ type: 'DESCRIPTION', content: product.description });
    if (product.specifications) {
      chunks.push({ type: 'SPECIFICATIONS', content: JSON.stringify(product.specifications) });
    }
    return chunks;
  }
}
