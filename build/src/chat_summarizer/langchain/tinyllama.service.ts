/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { ChatOllama } from '@langchain/ollama';
import { HumanMessage } from '@langchain/core/messages';

@Injectable()
export class TinyLlamaService {
  private llm = new ChatOllama({
    baseUrl: process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434',
    model: process.env.OLLAMA_MODEL || 'tinyllama',
  });

  async callLLM(prompt: string): Promise<string> {
    const res = await this.llm.invoke([new HumanMessage(prompt)]);
    if (typeof res.content === 'string') return res.content;

    if (Array.isArray(res.content)) {
      return res.content.map((part: any) => part.text).join('');
    }

    return JSON.stringify(res.content);
  }
}
