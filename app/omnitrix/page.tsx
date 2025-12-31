'use client';
import { useAliens } from '@/lib/Store';
import OmnitrixDirectory from '@/app/components/OmnitrixDirectory';
import OmnitrixLoader from '@/app/components/OmnitrixLoader';
import { motion } from 'framer-motion';
import OmnitrixBackground from '../components/OmnitrixBackground';
import ExplorerBackground from '../components/ExplorerBackground';

export default function OmnitrixPage() {
  const { allAliens, isLoading, error } = useAliens();

  if (isLoading) {
    return (
      <div>
        <OmnitrixLoader />
      </div>
    );
  }

  if (error) {
    return <div>Error loading aliens: {error.message}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      
      
      <OmnitrixDirectory aliens={allAliens} />
    </motion.div>
  );
}