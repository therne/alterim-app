import React from 'react';
import { cn } from '~/lib/utils';

export const Typo = {
  h1: ({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className={cn('scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-2xl', className)} {...props}>
      {children}
    </h1>
  ),
  h2: ({ className, children, border, ...props }: React.HTMLAttributes<HTMLHeadingElement> & { border?: boolean }) => (
    <h2
      className={cn(
        'mt-10 scroll-m-20 pb-2 text-3xl font-medium tracking-tight transition-colors first:mt-0',
        border && 'border-b border-b-slate-200 dark:border-b-slate-700',
        className,
      )}
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className={cn('scroll-m-20 text-2xl font-semibold tracking-tight', className)} {...props}>
      {children}
    </h3>
  ),
  h4: ({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4 className={cn('scroll-m-20 text-xl font-semibold tracking-tight', className)} {...props}>
      {children}
    </h4>
  ),
  p: ({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className={cn('leading-7 [&:not(:first-child)]:mt-6', className)} {...props}>
      {children}
    </p>
  ),
  blockquote: ({ className, children, ...props }: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className={cn(
        'mt-6 border-l-2 border-slate-300 pl-6 italic text-slate-800 dark:border-slate-600 dark:text-slate-200',
        className,
      )}
      {...props}
    >
      {children}
    </blockquote>
  ),
  large: ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn('text-lg font-semibold', className)} {...props}>
      {children}
    </div>
  ),
  small: ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <small className={cn('text-sm font-medium leading-none', className)} {...props}>
      {children}
    </small>
  ),
  muted: ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <p className={cn('text-sm text-muted', className)} {...props}>
      {children}
    </p>
  ),
  code: ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <code
      className={cn('relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold', className)}
      {...props}
    >
      {children}
    </code>
  ),
  pre: ({ className, children, ...props }: React.HTMLAttributes<HTMLPreElement>) => (
    <pre
      className={cn('relative rounded overflow-x-scroll bg-muted px-[1rem] py-[0.8rem] font-mono text-sm', className)}
      {...props}
    >
      {children}
    </pre>
  ),
  lead: ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <p className={cn('text-xl text-muted-foreground', className)} {...props}>
      {children}
    </p>
  ),
  ul: ({ className, children, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className={cn('my-6 ml-6 list-disc [&>li]:mt-2', className)} {...props}>
      {children}
    </ul>
  ),
};
