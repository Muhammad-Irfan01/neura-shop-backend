import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EmbeddingService } from '../embedding/embedding.service';

@Injectable()
export class VectorStoreService {
  constructor(
    private prisma: PrismaService,
    private embeddingService: EmbeddingService,
  ) {}

  async storeChunk(productId: string, type: string, content: string) {
    const embedding = await this.embeddingService.getEmbedding(content);
    // Convert embedding array to string format for pgvector
    const embeddingString = `[${embedding.join(',')}]`;
    
    return this.prisma.$executeRaw`
      INSERT INTO "ProductChunk" ("id", "productId", "chunkType", "content", "embedding")
      VALUES (gen_random_uuid(), ${productId}, ${type}, ${content}, ${embeddingString}::vector)
    `;
  }

  async search(query: string, limit = 5): Promise<any[]> {
    const embedding = await this.embeddingService.getEmbedding(query);
    const embeddingString = `[${embedding.join(',')}]`;
    
    // Search using pgvector
    return this.prisma.$queryRaw`
      SELECT "id", "productId", "chunkType", "content", "embedding" <=> ${embeddingString}::vector AS distance
      FROM "ProductChunk"
      ORDER BY distance
      LIMIT ${limit}
    `;
  }
}
