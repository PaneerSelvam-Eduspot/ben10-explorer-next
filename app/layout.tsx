import './globals.css';
import { ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { AlienProvider } from '@/lib/Store';
import Header from './components/Header';
import { LoadingProvider } from './components/LoadingProvider';

export const metadata = {
  title: 'Omnitrix Directory',
  description: 'Ben 10 explorer built with Next.js',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <LoadingProvider>
          <Header />
          <AlienProvider>{children}</AlienProvider>
          </LoadingProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}