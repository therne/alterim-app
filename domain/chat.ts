import OpenAI from 'openai';
import { Profile } from '~/domain/persona';

export interface ChatRequest {
  id?: string;
  profile: Profile;
  persona: string;
  messages: OpenAI.ChatCompletionMessageParam[];
}
