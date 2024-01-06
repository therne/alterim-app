'use client';

import React from 'react';
import { Toaster } from 'sonner';
import { cn } from '~/lib/utils';
import { ToastProvider } from '~/components/ui/toast';
import { TooltipProvider } from '~/components/ui/tooltip';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <ToastProvider>{children}</ToastProvider>
      <Toaster />
    </TooltipProvider>
  );
}
