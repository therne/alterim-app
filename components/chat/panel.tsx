'use client';

import * as React from 'react';
import { useChat, type Message, type UseChatHelpers } from 'ai/react';
import { useAtomValue } from 'jotai';
import { RefreshCw, Send, StopCircle } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import Textarea from 'react-textarea-autosize';
import { useAtBottom } from '~/lib/hooks/use-at-bottom';
import { useEnterSubmit } from '~/lib/hooks/use-enter-submit';
import { cn } from '~/lib/utils';
import { ButtonScrollToBottom } from '~/components/chat/button-scroll-to-bottom';
import { ChatMessage } from '~/components/chat/message';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '~/components/ui/card';
import { ScrollArea } from '~/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip';
import { useToast } from '~/components/ui/use-toast';
import { personaAtom, profileAtom } from '~/states/persona';

export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[];
  id?: string;
}

export function ChatPane({ id, initialMessages, className }: ChatProps) {
  const { toast } = useToast();
  const profile = useAtomValue(profileAtom);
  const persona = useAtomValue(personaAtom);
  const { messages, append, reload, stop, isLoading, input, setInput } = useChat({
    api: '/api/chat',
    initialMessages,
    body: {
      id,
      profile,
      persona,
    },
    async onResponse(response) {
      if (response.status !== 200) {
        toast({ title: response.statusText, description: await response.text() });
      }
    },
    onError(err) {
      toast({ title: err.name, description: err.message });
    },
  });

  const { formRef, onKeyDown } = useEnterSubmit();
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <Card className={cn('flex flex-col h-full', className)}>
      <CardHeader>
        <CardTitle>Chat</CardTitle>
      </CardHeader>
      <ScrollArea className="flex-1 px-6">
        {messages.length ? (
          <>
            {messages.map((message, index) => (
              <ChatMessage key={index} message={message} className="mb-4 md:mb-8" />
            ))}
            <ChatScrollAnchor trackVisibility={isLoading} />
          </>
        ) : (
          <p>
            {!persona || !profile
              ? "Generate your PFP's persona to start a chat."
              : `Let's DM with your ${profile.name}`}
          </p>
        )}
        <div className="inset-x-0 bottom-0 w-full animate-in duration-300 ease-in-out">
          <ButtonScrollToBottom />
          <div className="mx-auto sm:max-w-2xl sm:px-4">
            <div className="flex items-center justify-center h-12">
              {isLoading ? (
                <Button variant="outline" onClick={() => stop()} className="bg-background">
                  <StopCircle className="w-4 h-4 mr-2" />
                  Stop generating
                </Button>
              ) : (
                messages?.length >= 2 && (
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={() => reload()}>
                      <RefreshCw className="w-4 h-4  mr-2" />
                      Regenerate response
                    </Button>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </ScrollArea>
      <CardFooter className="mt-8">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!input?.trim()) {
              return;
            }
            setInput('');
            await append({
              id,
              content: input,
              role: 'user',
            });
          }}
          ref={formRef}
          className="flex flex-row space-x-2 w-full max-h-60"
        >
          <Textarea
            ref={inputRef}
            tabIndex={0}
            onKeyDown={onKeyDown}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Send a message."
            spellCheck={false}
            className="text-base px-4 py-1.5 border rounded-md w-full resize-none bg-transparent focus-within:outline-none"
          />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="submit" disabled={!persona || isLoading || input === ''}>
                <Send className="w-4 h-4" />
                <span className="sr-only">Send message</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Send message</TooltipContent>
          </Tooltip>
        </form>
      </CardFooter>
    </Card>
  );
}

export interface ChatPanelProps
  extends Pick<UseChatHelpers, 'append' | 'isLoading' | 'reload' | 'messages' | 'stop' | 'input' | 'setInput'> {
  id?: string;
  title?: string;
}

interface ChatScrollAnchorProps {
  trackVisibility?: boolean;
}

function ChatScrollAnchor({ trackVisibility }: ChatScrollAnchorProps) {
  const isAtBottom = useAtBottom();
  const { ref, entry, inView } = useInView({
    trackVisibility,
    delay: 100,
    rootMargin: '0px 0px -150px 0px',
  });

  React.useEffect(() => {
    if (isAtBottom && trackVisibility && !inView) {
      entry?.target.scrollIntoView({
        block: 'start',
      });
    }
  }, [inView, entry, isAtBottom, trackVisibility]);

  return <div ref={ref} className="h-px w-full" />;
}
