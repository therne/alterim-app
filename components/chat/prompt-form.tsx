import * as React from 'react';
import { useRouter } from 'next/navigation';
import { UseChatHelpers } from 'ai/react';
import { Send } from 'lucide-react';
import Textarea from 'react-textarea-autosize';
import { useEnterSubmit } from '~/lib/hooks/use-enter-submit';
import { Button } from '~/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip';

export interface PromptProps extends Pick<UseChatHelpers, 'input' | 'setInput'> {
  onSubmit: (value: string) => void;
  isLoading: boolean;
}

export function PromptForm({ onSubmit, input, setInput, isLoading }: PromptProps) {}
