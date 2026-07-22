import { Injectable, Logger } from '@nestjs/common';
import { OpenAIEmbeddings } from '@langchain/openai';
import Redis from 'ioredis';

@Injectable()
export class EmbeddingService {
  private embeddings: OpenAIEmbeddings;
  private redis: Redis;
  private readonly logger = new Logger(EmbeddingService.name);

  constructor() {
    this.embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: 'text-embedding-3-small',
    });
    this.redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
  }

  async getEmbedding(text: string): Promise<number[]> {
    const cacheKey = `embedding:${Buffer.from(text).toString('base64').substring(0, 50)}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
    
    const embedding = await this.embeddings.embedQuery(text);
    await this.redis.set(cacheKey, JSON.stringify(embedding), 'EX', 86400); // Cache for 24h
    return embedding;
  }
}
