import { Injectable } from '@nestjs/common';
import { VectorStoreService } from '../vector-store/vector-store.service';
import { PromptTemplateService } from '../prompt-template/prompt-template.service';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage } from '@langchain/core/messages';

@Injectable()
export class QueryService {
  private chatModel: ChatOpenAI;

  constructor(
    private vectorStore: VectorStoreService,
    private promptTemplate: PromptTemplateService,
  ) {
    this.chatModel = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: 'gpt-4o',
    });
  }

  async query(query: string) {
    const chunks = await this.vectorStore.search(query);
    const prompt = this.promptTemplate.formatPrompt(query, chunks);
    const response = await this.chatModel.invoke([new HumanMessage(prompt)]);
    return response.content;
  }
}
