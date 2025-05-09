/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class GeminiService {
  private readonly endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
  private readonly apiKey = process.env.GEMINI_API_KEY;

  async callLLM(prompt: string): Promise<string> {
    const headers = { 'Content-Type': 'application/json' };
    const body = {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    };

    const res = await axios.post(`${this.endpoint}?key=${this.apiKey}`, body, { headers });
    const candidates = res.data?.candidates;
    return candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini.';
  }
}
