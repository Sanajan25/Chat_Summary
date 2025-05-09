/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { GeminiService } from './gemini.service';
import { TinyLlamaService } from './tinyllama.service';

@Injectable()
export class LangchainService {
  constructor(
    private readonly gemini: GeminiService,
    private readonly tinyllama: TinyLlamaService,
  ) {}

  private async callModel(prompt: string, provider?: 'gemini' | 'tinyllama'): Promise<string> {
    const selectedProvider = provider || (process.env.LLM_PROVIDER as 'gemini' | 'tinyllama') || 'tinyllama';
    if (selectedProvider === 'gemini') {
      return this.gemini.callLLM(prompt);
    } else {
      return this.tinyllama.callLLM(prompt);
    }
  }

  async summarize(chat: string, provider?: 'gemini' | 'tinyllama'): Promise<string> {
    const prompt = `You are a summarizer assistant. Summarize the following conversation between a teacher and child in 2-3 sentences with a child-friendly tone:\n\n${chat}`;
    return this.callModel(prompt, provider);
  }

  async analyze(chat: { sender: string; content: string }[], provider?: 'gemini' | 'tinyllama'): Promise<string> {
    const prompt = `
You are an expert chat analyzer. Given a conversation between a teacher and a trainee, extract question-answer dynamics.

Steps:
1. Identify all questions asked by the **Trainee**.
2. Categorize each question as: Why, Where, When, What, or Who (based on the question word).
3. Check if the **Child** replied after each question (within a few lines).
4. Count how many questions were asked and answered per type.
5. Calculate "% Trainee" = (Responded / Total Questions per type), rounded to 2 decimal places.
6. Include row-wise totals.

Respond **ONLY** with a markdown table in the format below — no extra commentary or explanation.

| S L | Parameter(s)       | Why | Where | When | What | Who | Total |
|-----|--------------------|-----|-------|------|------|-----|-------|
| 1   | Total Questions    |     |       |      |      |     |       |
| 2   | Responded          |     |       |      |      |     |       |
| 3   | % Trainee          |     |       |      |      |     |       |

Conversation:
${chat.map(c => `${c.sender}: ${c.content}`).join('\n')}
`;
    return this.callModel(prompt, provider);
  }
}
