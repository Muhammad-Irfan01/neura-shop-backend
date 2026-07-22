import { Module } from '@nestjs/common';
import { EmbeddingService } from './embedding/embedding.service';
import { ChunkingService } from './chunking/chunking.service';
import { VectorStoreService } from './vector-store/vector-store.service';
import { QueryService } from './query/query.service';
import { PromptTemplateService } from './prompt-template/prompt-template.service';

@Module({
  providers: [EmbeddingService, ChunkingService, VectorStoreService, QueryService, PromptTemplateService],
  exports: [EmbeddingService, ChunkingService, VectorStoreService, QueryService, PromptTemplateService]
})
export class RagModule {}
