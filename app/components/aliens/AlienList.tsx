'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAliens, Alien } from '@/lib/Store';
import { useRouter } from 'next/navigation';
import OmnitrixLoader from '../shared/OmnitrixLoader';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleDot } from '@fortawesome/free-solid-svg-icons/faCircleDot';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { useSession } from '@/lib/auth-client'; 
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';

const PLACEHOLDER_URL = 'https://placehold.co/128x128/059669/FFFFFF?text=OMNITRIX';

export default function AlienList() {
  const { aliens, isLoading, error, search, series, showFavorites } = useAliens();
  const router = useRouter();
  const { data: session } = useSession(); // Get session data
  const [isFiltering, setIsFiltering] = useState(false);
  const [visibleAliens, setVisibleAliens] = useState<Alien[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isFavoritesLoading, setIsFavoritesLoading] = useState(false);
  const [isMoreLoading, setIsMoreLoading] = useState(false);

  const isLoggedIn = !!session?.user;
  

  // Load favorites from localStorage on mount
  useEffect(() => {
    if (!isLoggedIn) {
      setFavorites([]);
      return;
    }

    
   const fetchFavorites = async () => {
    setIsFavoritesLoading(true);
    try {
      const response = await fetch('../api/favorites');
      if (response.ok) {
         const data = await response.json();
         setFavorites(data.favorites || []);
      } else if (response.status === 401) {
        setFavorites([]);
      }
    } catch (error) {
      console.error('Failed to fetch favorites:', error);
      toast.error('Failed to load favorites');
    } finally {
      setIsFavoritesLoading(false);
    }
   };

   fetchFavorites();
  }, [isLoggedIn]);



  // Toggle favorite
  const toggleFavorite = async (sourceId: number) => {
    if (!isLoggedIn) {
      toast.error('Please log in to add favorites!');
      return;
    }
  
    const isCurrentlyFavorite = favorites.includes(sourceId);

    //instant UI feedback 

    setFavorites((prev) => 
      isCurrentlyFavorite
        ? prev.filter((id) => id !== sourceId)
        : [...prev, sourceId]
    );

    try {
      const response = await fetch('../api/favorites', {
        method: isCurrentlyFavorite ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceId }),
      });

      if (!response.ok) {
        throw new Error('Failed to update favorites');
      }

      toast.success(isCurrentlyFavorite ? 'Removed from favorites' : 'Added to favorites');
    } catch (error) {
      //Revert optimistic update on error
      setFavorites((prev) => 
        isCurrentlyFavorite
          ? [...prev, sourceId]
          : prev.filter((id) => id !== sourceId)
      )
      toast.error('Failed to update favorites');
      console.error('Error toggling favorite', error);
    }
  };

  useEffect(() => {
    if (!aliens) return;
    setIsFiltering(true);
    const timer = setTimeout(() => setIsFiltering(false), 600);
    return () => clearTimeout(timer);
  }, [search, series, aliens, showFavorites]);

  const filteredAliens = useMemo(() => {
    return aliens.filter((alien) => {
      return !showFavorites || favorites.includes(alien.id);
    });
  }, [aliens, showFavorites, favorites]);

  useEffect(() => {
    setVisibleAliens(filteredAliens.slice(0, 9));
  }, [filteredAliens]);

      const loadMore = () => {
        setIsMoreLoading(true);
        setTimeout(() => {
          setVisibleAliens(prev => [
            ...prev,
            ...filteredAliens.slice(visibleAliens.length, visibleAliens.length + 9)
          ]);
          setIsMoreLoading(false);
        }, 1000)
      }
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
      <div className="text-center mt-10 md:text-lg md:w-2xl mx-auto radial-bg-dark border text-white/70 border-[#00FF00] p-6 rounded-md">
        {showFavorites ? (
          isLoggedIn ? (
            // User is logged in but has no favorites
            <div className="space-y-4">
              <p className="text-xl text-green-400">No favorites found</p>
              <p className="text-sm text-gray-400">
                Add your favorites to see them here!
              </p>
            </div>
          ) : (
            // User is not logged in - prompt to log in
            <div className="space-y-4">
              <p className="text-xl text-yellow-400">Login Required</p>
              <p className="text-sm text-gray-400">
                Please log in to access and save your favorite aliens.
              </p>
              <button
                onClick={() => router.push('/login')}
                className="mt-4 px-6 py-2 bg-green-500 hover:bg-green-600 text-black font-bold rounded-md transition-all duration-300"
              >
                Log In
              </button>
            </div>
          )
        ) : series ? (
          `No aliens found in ${series}${search ? ` matching "${search}"` : ''}`
        ) : (
          'No aliens found matching your search.'
        )}
      </div>
    );

  return (
    <div>
      <AnimatePresence>
        <motion.ul
          key={filteredAliens.length}
          className="grid grid-cols-1 sm:gap-4 md:gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 mt-6 md:w-185 lg:w-250 xl:w-300 mx-auto overflow-y-auto overflow-x-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {visibleAliens.map((alien: Alien) => (
            <li
              key={alien.name}
              className="flex flex-col text-center card-wrapper p-1 rounded-xl text-[#00FF00]/70 transition duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden"
              /*style={{
                boxShadow: '0 5px 10px #00FF00',
              }}*/
            >
              <div className='relative card-content radial-bg-dark '>
              <div className='flex justify-end mr-4'> 
                <FontAwesomeIcon
                  icon={faHeart}
                  className={`ml-4 mt-4 transition-colors cursor-pointer ${
                    favorites.includes(alien.id) ? 'text-red-500' : 'text-gray-700'
                  } ${isLoggedIn ? 'hover:text-red-300' : 'hover:text-gray-600'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(alien.id);
                  }}
                />
              </div>

              <div
                className="flex-1 flex flex-col p-6"
                onClick={() => router.push(`/alien/${encodeURIComponent(alien.name)}`)}
              >
                <Image
                  className="w-32 h-32 flex-shrink-0 mx-auto radial-bg-dark rounded-full object-contain text-[#00FF00]/80 border-3 border-[#00FF00]/70 p-2 aspect-square"
                  src={alien.image || PLACEHOLDER_URL}
                  alt={alien.name}
                  width={128}
                  height={128}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).onerror = null;
                    (e.currentTarget as HTMLImageElement).src = PLACEHOLDER_URL;
                  }}
                />
                <div className="text-xs font-light text-gray-100 mt-2">
                  {alien.species}
                </div>
                <h3 className="text-xl font-bold text-white mt-1">{alien.name}</h3>
              </div>
              </div>
            </li>
          ))}
        </motion.ul>
      </AnimatePresence>
      {visibleAliens.length < filteredAliens.length && (
        <div className="flex items-center justify-center">
         {isMoreLoading ? (
            <motion.img 
              src='./ben10-omnitrix.png'
              className='h-8 w-8 '
              animate={{ rotate: 360}}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ) : (    <motion.button 
                    className={` px-6 py-2 mt-4 rounded-md relative radial-bg hover:scale-101 active:scale-95`}
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
                    onClick={loadMore}
                  >
                   <span className='text-neutral-100 tracking-wide font-light h-full w-full block relative linear-mask'>
                    Load More
                   </span>
                    <span  className='block absolute inset-0 rounded-md p-px linear-overlay'/>
                  </motion.button>
        )}
        </div>
      )}
    </div>
  );
}