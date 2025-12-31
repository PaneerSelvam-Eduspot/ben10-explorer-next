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
    <div className="flex flex-col-reverse gap-4 md:flex-row justify-between lg:px-1 px-4 md:w-185 lg:w-250 xl:w-300 mx-auto">  
      <div className='flex justify-center items-center mt-4'>
        <motion.button 
          className={` px-6 py-2 rounded-md relative radial-bg hover:scale-101 active:scale-95 ${
            showFavorites 
              ? 'bg-black/20 border-red-500/50 hover:border-red-600 border' 
              : 'bg-black/80 text-gray-400 border-green-500/50 hover:border-green-600 border hover:text-green-400'
          }`}
          initial={{ "--x": "100%", scale: 1 }}
          animate={{ "--x": "-100%" }}
          whileTap={{ scale: 0.97 }}
          transition={{
             repeat: Infinity,
             repeatType: "loop",
             repeatDelay: 0.5,
             type: "spring",
             stiffness: 20,
             damping: 15,
             mass: 2,
             scale :{
              type: "spring",
              stiffness: 10,
              damping: 5,
              mass: 0.1
             }
          }}
          onClick={() => setShowFavorites(!showFavorites)}
        >
         <span className='text-neutral-100 tracking-wide font-light h-full w-full block relative linear-mask'>
             Favorite Aliens
         </span>
          
          <span  className='block absolute inset-0 rounded-md p-px linear-overlay'/>
         
          {/* Glow effect when active */}
          {showFavorites && (
            <motion.div
              className="absolute inset-0 bg-red-500/10 rounded-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </motion.button>
      </div>
      
      <div className='mt-4 md:w-82 flex flex-row'>
        <label htmlFor="series-filter" className="text-md md:w-24 mt-2 mr-1 text-gray-300">
          
          Filter By
        </label>
        <motion.select
          id="series-filter" 
          className="md:w-full rounded-md border-2 text-gray-100  relative radial-bg shadow-sm focus:border-green-500 focus:ring-green-500 px-2 py-2 transition-all duration-300 hover:border-green-400"
          value={series} 
          onChange={(e) => setSeries(e.target.value)}
        >
          
          <option value="">
            All Series
          </option>
          
          {seriesOptions.map(({ value, label }) => (
            <option key={value} value={value}>
          
              {label}
              
            </option>  
          ))}
        </motion.select>
        
      </div>
    </div>
  );
}