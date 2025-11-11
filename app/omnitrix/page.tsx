'use client';

import { useEffect } from 'react';
import { useLoading } from '../components/LoadingProvider';
import OmnitrixDirectory from '../components/OmnitrixDirectory';
import { useAliens } from '@/lib/Store';

export default function OmnitrixPage() {
  const { showLoader, hideLoader } = useLoading();
  const { aliens, isLoading } = useAliens();

  useEffect(() => {
    

    if (isLoading) {
      showLoader();
    } else {
      hideLoader();
    }
  }, [isLoading, showLoader, hideLoader]);

  if (isLoading) {
    return null; // Loading is handled by the OmnitrixLoader
  }

  return (
   <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-green-900/20 p-8">
      
        
        <div className="omnitrix-card p-6">
          <OmnitrixDirectory aliens={aliens} />
        </div>
      </div>
   
  );
}