import { Injectable } from '@nestjs/common';

@Injectable()
export class PromptTemplateService {
  formatPrompt(query: string, contextChunks: any[]): string {
    const context = contextChunks.map(c => c.content).join('\n\n');
    return `
      You are a helpful shopping assistant. Use the following product context to answer the user's question.
      
      Context:
      ${context}
      
      Question: ${query}
      
      Answer:
    `;
  }
}
