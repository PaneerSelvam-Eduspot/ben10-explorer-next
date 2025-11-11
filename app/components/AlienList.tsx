'use client';
import React, { useMemo } from 'react';
import { useAliens, Alien } from '@/lib/Store';
import { useRouter } from 'next/navigation'; // ✅ Import router for navigation
import OmnitrixLoader from './OmnitrixLoader';
import { motion, AnimatePresence } from 'framer-motion';

const PLACEHOLDER_URL = 'https://placehold.co/128x128/059669/FFFFFF?text=OMNITRIX';

export default function AlienList() {
  const { aliens, isLoading, error, search, series } = useAliens();
  const router = useRouter(); // ✅ Initialize router
  const [isFiltering, setIsFiltering] = React.useState(false);

    React.useEffect(() => {
      if (!aliens) return;
      setIsFiltering(true);
      const timer = setTimeout(() => setIsFiltering(false), 600);
      return () => clearTimeout(timer);
    }, [search, series]);


  const filteredAliens = useMemo(() => {
    return aliens.filter((alien) => {
      const q = search.toLowerCase().trim();
      const searchMatch =
        q === '' ||
        alien.name.toLowerCase().includes(q) ||
        alien.species.toLowerCase().includes(q);
      const seriesMatch =
        !series ||
        String(alien.series).toLowerCase().includes(series.toLowerCase());
      return searchMatch && seriesMatch;
    });
  }, [aliens, search, series]);

 if (isLoading) return <OmnitrixLoader />;
 if (isFiltering) return <OmnitrixLoader />;

  if (error)
    return (
      <div className="text-center mt-10 text-xl text-red-600">
        Error fetching data: {error.message}
      </div>
    );

  if (filteredAliens.length === 0)
    return (
      <div className="text-center mt-10 md:text-xl md:w-2xl mx-auto bg-black border border-green-400 p-4 rounded-md">
        {series
          ? `No aliens found in ${series}${
              search ? ` matching "${search}"` : ''
            }`
          : 'No aliens found matching your search.'}
      </div>
    );

  return (
    <AnimatePresence>
   <motion.ul
    key={filteredAliens.length}
    className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-6 md:w-300 mx-auto"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.4 }}
  >
      {filteredAliens.map((alien: Alien) => (
        <li
          key={alien.name}
          onClick={() => router.push(`/alien/${encodeURIComponent(alien.name)}`)} // ✅ Navigate on click
          className="flex flex-col text-center rounded-xl shadow-md shadow-green-500  bg-black border border-green-400 hover:shadow-lg transition duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden"
        >
          <div className="flex-1 flex flex-col p-6">
            <img
              className="w-32 h-32 flex-shrink-0 mx-auto bg-gray-950 rounded-full object-contain border-3 border-green-700 p-2 aspect-square"
              src={alien.image || PLACEHOLDER_URL}
              alt={alien.name}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).onerror = null;
                (e.currentTarget as HTMLImageElement).src = PLACEHOLDER_URL;
              }}
            />
            <div className="text-xs font-light text-gray-100 mt-2">
              {alien.species}
            </div>
            <h3 className="text-xl font-bold text-white mt-1">
              {alien.name}
            </h3>
          </div>
        </li>
      ))}
     </motion.ul>
   </AnimatePresence>
  );
}
