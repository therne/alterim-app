import { OpenAIStream, StreamingTextResponse } from 'ai';
import OpenAI from 'openai';
import { ChatRequest } from '~/domain/chat';

export const runtime = 'edge';

export async function POST(req: Request) {
  const { id, messages, profile, persona }: ChatRequest = await req.json();
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const response = await openai.chat.completions.create({
    model: 'gpt-4-1106-preview',
    temperature: 1.0,
    seed: 12345678,
    stream: true,
    messages: [
      {
        role: 'system',
        content: `You're an AI NPC named ${profile.name}.
Answer with following personality:
${persona}

Rules:
- BE SIMPLE: Answer with a single sentence.
- This is Twitter DM, not a tweet message. so be casual and DM-like. (e.g. "im fine" instead of "I am fine")
- lowercase only.
- Do not use hashtags, mentions, or links at all.
`.trim(),
      },
      ...messages,
    ],
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
