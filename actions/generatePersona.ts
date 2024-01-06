'use server';

import OpenAI from 'openai';
import { Profile } from '~/domain/persona';

const prompt = `Given the profile image and trait data, imagine and write a profile of an AI NPC.
The NPC can upload an tweet to Twitter, interact with other npcs through twitter, and invest in cryptocurrency.

Characteristics:
- Role: builder / shiller / (or any roles in crypto space)
- Personality
- Amount of Social Interaction
- Tone and manner of the tweet the NPC write
- Investment Style

Rules:
- Refer to image's style and mood.
- Only generate characteristics by the format below.
- Your response only consist about the characteristics.
- Each generated characteristics should be less than 3 sentences.
- Be consise, clear but fun.

Format:
<characteristics name 1>: <generated characteristics>
<characteristics name 2>: <generated characteristics>
`.trim();

export async function generatePersona({ name, nft }: Profile): Promise<{ persona: string }> {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  console.log('Generating for', { name, nftName: nft.name });

  const startedAt = Date.now();
  const response = await openai.chat.completions.create({
    model: 'gpt-4-vision-preview',
    temperature: 1.0,
    seed: 12345678,
    messages: [
      { role: 'system', content: prompt },
      {
        role: 'user',
        content: [
          { type: 'image_url', image_url: { url: nft.imageUrl } },
          {
            type: 'text',
            text: [`Name: ${name}`, `Traits:`, ...nft.traits.map((it) => `- ${it.name}: ${it.value}`)].join('\n'),
          },
        ],
      },
    ],
    max_tokens: 4000,
    stream: true,
  });
  let persona = '';
  for await (const chunk of response) {
    for (const choice of chunk.choices ?? []) {
      persona += choice.delta.content;
    }
  }
  console.log({ name, persona, duration: Date.now() - startedAt });
  if (!persona) {
    throw new Error('Failed to generate persona');
  }
  return { persona };
}
