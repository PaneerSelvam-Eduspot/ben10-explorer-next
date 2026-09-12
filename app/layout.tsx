'use client'

import './globals.css';
import { ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { AlienProvider } from '@/lib/Store';
import Header from './components/layout/Header';
import { LoadingProvider } from './components/layout/LoadingProvider';
import Footer from './components/layout/Footer';
import LoginNavbar from './components/layout/LoginNavbar';
import { usePathname } from 'next/navigation';
import RagIcon from './components/chat/RagIcon';



export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <LoadingProvider>
            {pathname !== '/login' && pathname !== '/dashboard' && <LoginNavbar  /> }
           {pathname !== '/login' && pathname !== '/dashboard' && <Header />}
          <main>
          <AlienProvider>{children}</AlienProvider>
          </main>
          {pathname !== '/login' && pathname !== '/dashboard' && <RagIcon />}
          {pathname === '/' && <Footer />}
          </LoadingProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}