'use client';
import React from 'react';
import { useAliens } from '@/lib/Store';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function FilterAliens() {
  const { series, setSeries, showFavorites, setShowFavorites } = useAliens();

  const seriesOptions = [
    { value: 'Classic', label: 'Ben 10: Classic' },
    { value: 'Alien Force', label: 'Ben 10: Alien Force' },
    { value: 'Ultimate Alien', label: 'Ben 10: Ultimate Alien' },
  ];

  return (
    <div className="flex flex-row justify-between p-2 md:w-300 mx-auto">
      <div className='flex justify-center items-center'>
        <Button 
          className={`px-6 py-4 border mt-4 transition-all duration-300 active:scale-95 relative overflow-hidden ${
            showFavorites 
              ? 'bg-red-500/20 border-red-500 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.3)]' 
              : 'bg-black/80 border-white text-gray-400 hover:border-green-500 hover:text-green-400'
          }`}
          onClick={() => setShowFavorites(!showFavorites)}
        >
         
          Favorite Aliens
          
          {/* Glow effect when active */}
          {showFavorites && (
            <motion.div
              className="absolute inset-0 bg-red-500/10 rounded-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </Button>
      </div>
      
      <div className='mt-4 md:w-82 flex flex-row'>
        <label htmlFor="series-filter" className="text-md md:w-24 mt-2 mr-1 text-gray-300">
          Filter By
        </label>
        <select 
          id="series-filter" 
          className="md:w-full rounded-md border-2 border-green-200 text-gray-400 bg-black shadow-sm focus:border-green-500 focus:ring-green-500 px-2 py-2 transition-all duration-300 hover:border-green-400" 
          value={series} 
          onChange={(e) => setSeries(e.target.value)}
        >
          <option value="">All Series</option>
          {seriesOptions.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}