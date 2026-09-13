'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

const Header = dynamic(() => import('./Header'));
const Footer = dynamic(() => import('./Footer'));
const LoginNavbar = dynamic(() => import('./LoginNavbar'));
const RagIcon = dynamic(() => import('../chat/RagIcon'));

export default function ConditionalChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hideChrome = pathname === '/login' || pathname === '/dashboard';

  return (
    <>
      {!hideChrome && <LoginNavbar />}
      {!hideChrome && <Header />}
      {children}
      {!hideChrome && <RagIcon />}
      {pathname === '/' && <Footer />}
    </>
  );
}