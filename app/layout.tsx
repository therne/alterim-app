import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '~/styles/globals.css';
import { cn } from '~/lib/utils';
import { Providers } from '~/components/providers';


const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Alterim',
  description: 'Alterim is a new kind of social network.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
    <body className={cn('w-screen h-screen bg-zinc-100 font-sans antialiased', inter.variable)}>
    <Providers>
      <nav className="w-screen h-[64px] px-10 flex flex-row items-center">
        <h1 className="font-semibold tracking-tighter text-2xl">Alterim</h1>
      </nav>
      {children}
    </Providers>
    </body>
    </html>
  );
}
