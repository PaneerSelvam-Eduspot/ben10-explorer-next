'use client'

import './globals.css';
import { ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { AlienProvider } from '@/lib/Store';
import Header from './components/Header';
import { LoadingProvider } from './components/LoadingProvider';
import Footer from './components/Footer';
import LoginNavbar from './components/LoginNavbar';
import { usePathname } from 'next/navigation';



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
           {pathname !== '/login' && pathname !== '/dashboard'&& <Footer />}
          </LoadingProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}