// Inspired by Chatbot-UI and modified to fit the needs of this project
// @see https://github.com/mckaywrigley/chatbot-ui/blob/main/components/Chat/ChatMessage.tsx

import { useMemo } from 'react';
import { Message } from 'ai';
import { formatDistanceToNow } from 'date-fns';
import { Bot, User } from 'lucide-react';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import { cn } from '~/lib/utils';
import { MemoizedReactMarkdown } from '~/components/chat/markdown';
import { ChatMessageActions } from '~/components/chat/message-actions';
import { Typo } from '~/components/typo';

export interface ChatMessageProps {
  className?: string;
  message: Message;
}

export function ChatMessage({ message, className, ...props }: ChatMessageProps) {
  const isUser = useMemo(() => message.role === 'user', [message.role]);
  return (
    <div className={cn('mb-4 flex flex-col', isUser ? 'items-end' : 'items-start', className)} {...props}>
      <div
        className={cn(
          'max-w-[60%] px-3 py-1.5 select-none rounded-t-xl shadow',
          'text-white text-sm',
          isUser ? 'bg-blue-500 border-blue-400' : 'bg-zinc-500 border-zinc-400',
          isUser ? 'rounded-bl-xl rounded-br-sm' : 'rounded-br-xl rounded-bl-sm',
        )}
      >
        <MemoizedReactMarkdown
          className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
          remarkPlugins={[remarkGfm, remarkMath]}
          components={{
            p({ children }) {
              return <p className="mb-2 last:mb-0">{children}</p>;
            },
          }}
        >
          {message.content}
        </MemoizedReactMarkdown>
      </div>
      {message.createdAt && (
        <Typo.small className="text-muted-foreground/75 text-xs font-normal mt-1">
          {formatDistanceToNow(message.createdAt, { addSuffix: true })}
        </Typo.small>
      )}
    </div>
  );
}
