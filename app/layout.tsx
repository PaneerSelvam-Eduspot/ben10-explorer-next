
import './globals.css';
import { flexoDemi } from './fonts';
import { ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { AlienProvider } from '@/lib/Store';
import { LoadingProvider } from './components/layout/LoadingProvider';
import ConditionalChrome from './components/layout/ConditionalChrome';
import { Metadata } from 'next';


export const metadata: Metadata = {
  title: 'Ben10 Alien Explorer',
  description: 'Explore aliens, transformations and series from the Ben10 universe.' 
};


export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={flexoDemi.variable}>
      <body>
        <QueryClientProvider client={queryClient}>
          <LoadingProvider>
          <main>
          <AlienProvider>
            <ConditionalChrome>{children}</ConditionalChrome> 
          </AlienProvider>
          </main>
          </LoadingProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}