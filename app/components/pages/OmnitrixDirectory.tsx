'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import OmnitrixBackground from '../backgrounds/OmnitrixBackground';
import { useRouter } from 'next/navigation';

interface Alien {
  id: number;
  _id: string;
  name: string;
  image: string;
  species?: string;
  planet?: string;
  abilities?: string[] | string;
  series?: string;
  firstAppearance?: string;
  description?: string;
}

interface OmnitrixDirectoryProps {
  aliens: Alien[];
}

export default function OmnitrixDirectory({ aliens }: OmnitrixDirectoryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [isSymbolVisible, setIsSymbolVisible] = useState(true);
  const [isAlienClickable, setIsAlienClickable] = useState(false);
  const [dialRotation, setDialRotation] = useState(0);

  const currentAlien = aliens[selectedIndex];
  const router = useRouter();

  // Calculate angle per alien
  const anglePerAlien = 360 / aliens.length;

  const handleNavigation = (dir: 'next' | 'prev') => {
    if (isTransitioning || !aliens.length) return;
    if (isSymbolVisible) return;
    setIsTransitioning(true);
    setDirection(dir);

    if (dir === 'next') {
      setSelectedIndex((prev) => (prev + 1) % aliens.length);
      setDialRotation((prev) => prev + anglePerAlien * 3);
    } else {
      setSelectedIndex((prev) => (prev - 1 + aliens.length) % aliens.length);
      setDialRotation((prev) => prev - anglePerAlien * 3);
    }

    setTimeout(() => setIsTransitioning(false), 400);
  };

  if (!aliens.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <p className="text-green-400 text-xl">No aliens available</p>
      </div>
    );
  }

  return (
    <div>
      {/* Background component placeholder */}
       <OmnitrixBackground />
      
      {/* Main Container - Responsive min-height and padding */}
      <div className="min-h-[calc(100vh-60px)] sm:min-h-[calc(100vh-80px)] md:min-h-[calc(100vh-100px)] flex flex-col z-10 items-center relative justify-center px-4 py-8">
        
        {/* Controls Container - Responsive gap */}
        <div className="relative flex items-center justify-center gap-4 sm:gap-8 md:gap-16 w-full max-w-[90vw]">
          
          {/* Previous Button - Responsive size */}
          <motion.button
            onClick={() => handleNavigation('prev')}
            disabled={isTransitioning}
            className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 
                       border-2 border-green-500/50 flex items-center justify-center text-green-400 shadow-lg z-10 group 
                       disabled:opacity-50 flex-shrink-0"
            whileHover={{ scale: 1.1, borderColor: 'rgba(0, 255, 0, 0.8)' }}
            whileTap={{ scale: 0.95 }}
            style={{ boxShadow: '0 0 20px rgba(0, 255, 0, 0.3)' }}
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 group-hover:drop-shadow-[0_0_8px_rgba(0,255,0,0.8)]" />
          </motion.button>

          {/* Main Omnitrix Container - Responsive sizing */}
          <div className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] md:w-[400px] md:h-[400px] flex items-center justify-center flex-shrink-0">
            
            {/* Outer rotating ring with dial indicator */}
            <motion.div
              className="absolute w-full h-full"
              animate={{ rotate: dialRotation }}
              transition={{ duration: 0.4, ease: [0.45, 0, 0.55, 1] }}
            >
              {/* Outer circle with glow - Responsive inset */}
              <div
                className="absolute inset-[-6px] sm:inset-[-7px] md:inset-[-8px] rounded-full shadow-2xl border border-[#00FF00]/70"
                style={{
                  background: 'radial-gradient(circle, #00FF00 50%, #A9A9A9 50%)',
                  boxShadow: '0 0 60px 15px rgba(0, 255, 0, 0.6), inset 0 0 40px rgba(0, 0, 0, 0.8)',
                }}
              />

              {/* Dial Indicator Lines - Responsive */}
              {/* Vertical line */}
              <div 
                className="absolute left-1/2 top-0 -translate-x-1/2 bg-black"
                style={{
                  width: '2px',
                  height: 'calc(100% + 16px)',
                  top: '-8px',
                }}
              />
              
              {/* Horizontal line */}
              <div 
                className="absolute top-1/2 left-0 -translate-y-1/2 bg-black"
                style={{
                  height: '2px',
                  width: 'calc(100% + 16px)',
                  left: '-8px',
                }}
              />

              {/* Green glowing ring - Responsive inset */}
              <motion.div
                className="absolute inset-[18px] sm:inset-[22px] md:inset-[25px] rounded-full border"
                style={{
                  background: 'radial-gradient(circle, #BCC6CC60%, #C0C0C0 75%, #999B9B 90%, #A1A8B2 100%)',
                }}
                animate={{
                  boxShadow: [
                    '0 0 40px 8px rgba(192,192,192,0.8)',
                    '0 0 60px 12px rgba(176,176,176,1)',
                    '0 0 40px 8px rgba(192,192,192,0.8)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />

              {/* Dark border ring */}
              <div
                className="absolute inset-[18px] sm:inset-[22px] md:inset-[25px] rounded-full"
                style={{
                  background: 'radial-gradient(circle, #C0C0C0 50%, #393939 50%)',
                }}
              />
            </motion.div>

            {/* Center content area - Responsive inset */}
            <div className="absolute inset-4 sm:inset-[18px] md:inset-5 flex items-center justify-center border-2 border-[#C0C0C0] rounded-full">
              
              {/* Black background circle */}
              <div
                className="absolute rounded-full bg-black inset-0"
                style={{
                  boxShadow: 'inset 0 0 50px rgba(0, 0, 0, 0.9)',
                }}
              />

              {/* Clickable area for toggle */}
              <div
                className={`absolute inset-0 cursor-pointer ${
                  isAlienClickable ? "pointer-events-none" : "z-30"
                }`}
                onClick={() => {
                  if (isAlienClickable) return;
                  setIsSymbolVisible(!isSymbolVisible);
                }}
              />

              {/* Omnitrix Symbol (Hourglass) */}
              <motion.svg
                viewBox="0 0 100 100"
                className="absolute inset-0 h-full w-full z-20 pointer-events-none"
                style={{
                  filter: 'drop-shadow(0 0 10px rgba(0, 0, 0, 0.8))',
                }}
              >
                <motion.path
                  fill="#00FF00"
                  initial={{ d: 'M 20 10 Q 50 -10 80 10 L 50 65 Z', opacity: 1 }}
                  animate={
                    isSymbolVisible
                      ? { d: 'M 20 10 Q 50 -10 80 10 L 50 65 Z', opacity: 1 }
                      : { d: 'M 50 8 Q 50 5 50 8 L 50 10 Z', opacity: 0 }
                  }
                  transition={{ duration: 1.1, ease: [0.55, 0, 0.55, 1] }}
                />
                <motion.path
                  fill="#00FF00"
                  initial={{ d: 'M 20 90 Q 50 110 80 90 L 50 35 Z', opacity: 1 }}
                  animate={
                    isSymbolVisible
                      ? { d: 'M 20 90 Q 50 110 80 90 L 50 35 Z', opacity: 1 }
                      : { d: 'M 50 92 Q 50 95 50 92 L 50 90 Z', opacity: 0 }
                  }
                  transition={{ duration: 1.1, ease: [0.55, 0, 0.55, 1] }}
                />
              </motion.svg>

              {/* Alien Image with Diamond shape */}
              <motion.div
                className="absolute flex z-10 items-center justify-center cursor-pointer"
                style={{
                  clipPath: 'polygon(50% 0%, 90% 47%, 50% 100%, 13% 47%)',
                  background: '#00FF00',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/alien/${encodeURIComponent(currentAlien.name)}`);
                }}
                initial={{ inset: '190px', opacity: 0, scale: 0 }}
                animate={
                  isSymbolVisible && !isAlienClickable
                    ? { inset: '190px', opacity: 0, scale: 0 }
                    : { inset: '0px', opacity: 1, scale: 1 }
                }
                transition={{ duration: 1.1, ease: [0.55, 0, 0.55, 1] }}
                onAnimationComplete={() => {
                  if (!isSymbolVisible) setIsAlienClickable(true);
                }}
              >
                <motion.img
                  src={currentAlien.image}
                  alt={currentAlien.name}
                  className="w-[60%] h-[60%] object-contain"
                  style={{
                    filter: 'brightness(0) saturate(100%) contrast(2) drop-shadow(0 2px 8px rgba(0, 0, 0, 0.8))',
                  }}
                  initial={{ opacity: 0, scale: 1 }}
                  animate={
                    isSymbolVisible
                      ? { opacity: 0, scale: 1 }
                      : { opacity: 1, scale: 1 }
                  }
                  transition={{
                    duration: 0.2,
                    delay: 1,
                  }}
                />

                {/* Diamond border - Responsive stroke width */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none z-20"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <polygon
                    points="50,0 90,47 50,100 13,47"
                    fill="none"
                    stroke="#1C1018"
                    strokeWidth="7"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
              </motion.div>

              {/* Slow rotating energy ring */}
              <motion.div
                className="absolute inset-[-10px] bg-black z-0 rounded-full border-2 border-green-500/20"
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
              />
            </div>
          </div>

          {/* Next Button - Responsive size */}
          <motion.button
            onClick={() => handleNavigation('next')}
            disabled={isTransitioning}
            className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 
                       border-2 border-green-500/50 flex items-center justify-center text-green-400 shadow-lg z-10 group 
                       disabled:opacity-50 flex-shrink-0"
            whileHover={{ scale: 1.1, borderColor: 'rgba(0, 255, 0, 0.8)' }}
            whileTap={{ scale: 0.95 }}
            style={{ boxShadow: '0 0 20px rgba(0, 255, 0, 0.3)' }}
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 group-hover:drop-shadow-[0_0_8px_rgba(0,255,0,0.8)]" />
          </motion.button>
        </div>
        
        {/* Optional: Alien name display - Responsive text 

        <div className="mt-6 sm:mt-8 text-center">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#00FF00]">
            {!isSymbolVisible && currentAlien.name}
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            {!isSymbolVisible && currentAlien.species}
          </p>
        </div> */}
      </div>
    </div>
  );
}