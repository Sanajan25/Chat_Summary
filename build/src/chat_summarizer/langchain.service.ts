/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-wrapper-object-types */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import { HumanMessage} from "@langchain/core/messages";
import { ChatOllama } from '@langchain/ollama';

import { Injectable } from "@nestjs/common";


@Injectable()
export class LangchainService {
  
  private llm = new ChatOllama({
    baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
    model: process.env.OLLAMA_MODEL || 'tinyllama',  
  });
//   async summarize(chat:string):Promise<String>{
//     const promt =`You are a summarizer assistant. Summarize this teacher-child conversation in 2-3 child-friendly sentences:\n\n${chat}`;
//     const result=await this.llm.invoke([new HumanMessage(promt)]);
//     if (Array.isArray(result.content)) {
//         const textContent = result.content
//           .filter((message) => message && 'text' in message)  
//           .map((message: any) => message.text)  
//           .join(' ');  // Join the text content
  
//         return textContent || '';
//       } else {

//         return result.content?.toString() || '';
//       }
//     }
async summarize(chat: string): Promise<string> {
  const prompt = `You are a summarizer assistant. Summarize the following conversation between a teacher and child in 2-3 sentences with a child-friendly tone:\n\n${chat}`;

  const res = await this.llm.invoke([new HumanMessage(prompt)]);


  if (typeof res.content === 'string') {
    return res.content;
  }

  if (Array.isArray(res.content)) {
    const textParts = res.content
      .filter((part: any) => part.type === 'text')
      .map((part: any) => part.text);

    return textParts.join('');
  }

  throw new Error('Unexpected LLM response format.');
}
}
