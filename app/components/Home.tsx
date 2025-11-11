'use client';

import { useEffect } from 'react';
import { useLoading } from './LoadingProvider';

export default function Home() {
  const { showLoader, hideLoader } = useLoading();

  useEffect(() => {
    // Show loader on component mount
    showLoader();
    
    // Simulate loading time (you can adjust this or remove it)
    const timer = setTimeout(() => {
      hideLoader();
    }, 3000);

    return () => {
      clearTimeout(timer);
      hideLoader();
    };
  }, [showLoader, hideLoader]);

  return (
    <div className="p-8">
      <h1 className="text-4xl font-extrabold text-center text-green-700 mb-2">Omnitrix</h1>
      <p className="text-center text-gray-600 mt-4">Welcome to the Omnitrix Directory</p>
    </div>
  );
}