'use client';

import { useEffect, useState } from 'react';
import { useLoading } from './LoadingProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ExplorerBackground from './ExplorerBackground';
import NavBar from './LoginNavbar';

const series = [
  {
    id: 1,
    name: 'Ben 10 Classic',
    image: '/ben10-classic.png', 
    description: "This series follows ten-year-old Ben Tennyson, who accidentally finds the Omnitrix during a summer road trip with his Grandpa Max and cousin Gwen. The tone is lighthearted and episodic, centered on discovery as Ben learns to master the device's original ten unpredictable aliens. Facing villains like Vilgax and various B-movie monsters, the core theme is accountability, forcing an impulsive kid to grow into a responsible hero despite the watch's comedic misfires.",
  },
  {
    id: 2,
    name: 'Ben 10 Alien Force',
    image: '/ben10-alienforce.png', 
    description: "Set five years later, the tone becomes darker and more serialized as 15-year-old Ben leads a new team alongside Gwen and a reformed Kevin Levin. Ben wields a new, controlled Omnitrix and ten different aliens to combat global threats. With Grandpa Max missing, the trio steps up as the new Plumbers, facing the existential Highbreed invasion. This era explores themes of maturity and leadership, as Ben transitions from an accidental hero to a strategic intergalactic defender.",
  },
  {
    id: 3,
    name: 'Ben 10 Ultimate Alien',
    image: '/ben10-ultimatealien.png', 
    description: "Ben's identity is revealed to the world, forcing him to navigate global celebrity while dealing with the replacement Ultimatrix. This device introduces the 'Ultimate' feature, creating monstrous, battle-evolved versions of his aliens to handle cosmic-level threats. The narrative focuses on the weight of extreme power and public perception. Ben must manage villains like Aggregor and the god-like Diagon, pushing him to the absolute limits of his abilities and responsibility."
  },
];

export default function Home() {
  const { showLoader, hideLoader } = useLoading();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    showLoader();
    const timer = setTimeout(() => {
      hideLoader();
      setIsLoaded(true);
    }, 2000);

    return () => {
      clearTimeout(timer);
      hideLoader();
    };
    
  }, [showLoader, hideLoader]);

  const handleNext = () => {
    setDirection('next');
    setCurrentIndex((prev) => (prev + 1) % series.length);
  };

  const handlePrev = () => {
    setDirection('prev');
    setCurrentIndex((prev) => (prev - 1 + series.length) % series.length);
  };

  const currentSeries = series[currentIndex]; 
  const prevSeries = series[(currentIndex - 1 + series.length) % series.length];
  const nextSeries = series[(currentIndex + 1) % series.length];

  return (
    <div>
      <ExplorerBackground />

      {/* Show NOTHING until loading is done */}
      {!isLoaded && <div className="min-h-screen"></div>}

      {isLoaded && (
        <div className="sm:min-w-[200px] md:min-h-screen mt-[-65px] md:mt-[-26px] flex flex-col justify-center relative overflow-y-auto overflow-x-hidden">
          {/* Alien Slider Section */}
          <div className="w-full max-w-10xl mx-auto flex md:flex-row items-center justify-center gap-6 md:gap-10">
            {/* Alien Display Area */}
            <div className="flex-1 flex flex-col md:flex-row items-center justify-between max-w-7xl p-5 gap-8 md:gap-10 lg:gap-40">

              
              {/* Alien Image with Smooth 3-Image Carousel */}
              <div className="relative w-80 h-80 md:w-[26rem] md:h-[26rem] flex-shrink-0">
                <AnimatePresence mode="sync">
                  {/* PREVIOUS IMAGE (Left) */}
                  <motion.img
                    key={`prev-${currentIndex}`}
                    src={prevSeries.image}
                    alt="Previous series"
                    className="absolute w-full h-full object-contain pointer-events-none"
                    initial={{ x: -130, scale: 0.6, opacity: 0, filter: 'blur(5px)' }}
                    animate={{ 
                      x: -95, 
                      scale: 0.72, 
                      opacity: 0.35,
                      filter: 'blur(2.5px) drop-shadow(0 0 15px rgba(0,255,0,0.25))'
                    }}
                    exit={{ 
                      x: -150, 
                      scale: 0.5, 
                      opacity: 0,
                      filter: 'blur(7px)'
                    }}
                    transition={{ 
                      duration: 0.75, 
                      ease: [0.34, 1.56, 0.64, 1]
                    }}
                  />

                  {/* CURRENT IMAGE (Center - Main Focus) */}
                  <motion.img
                    key={`current-${currentIndex}`}
                    src={currentSeries.image}
                    alt={currentSeries.name}
                    className="absolute w-full h-full object-contain z-10"
                    initial={{
                      x: direction === 'next' ? 95 : -95,
                      scale: 0.72,
                      opacity: 0,
                      filter: 'blur(3px)',
                    }}
                    animate={{
                      x: 0,
                      scale: 1.1,
                      opacity: 1,
                      filter: 'blur(0px) drop-shadow(0 0 45px rgba(0,255,0,0.75))',
                    }}
                    exit={{
                      x: direction === 'next' ? -95 : 95,
                      scale: 0.72,
                      opacity: 0,
                      filter: 'blur(3px)',
                    }}
                    transition={{ 
                      duration: 0.75, 
                      ease: [0.34, 1.56, 0.64, 1],
                      scale: { duration: 0.85 }
                    }}
                  />

                  {/* NEXT IMAGE (Right) */}
                  <motion.img
                    key={`next-${currentIndex}`}
                    src={nextSeries.image}
                    alt="Next series"
                    className="absolute w-full h-full object-contain pointer-events-none"
                    initial={{ x: 130, scale: 0.6, opacity: 0, filter: 'blur(5px)' }}
                    animate={{ 
                      x: 95, 
                      scale: 0.72, 
                      opacity: 0.35,
                      filter: 'blur(2.5px) drop-shadow(0 0 15px rgba(0,255,0,0.25))'
                    }}
                    exit={{ 
                      x: 150, 
                      scale: 0.5, 
                      opacity: 0,
                      filter: 'blur(7px)'
                    }}
                    transition={{ 
                      duration: 0.75, 
                      ease: [0.34, 1.56, 0.64, 1]
                    }}
                  />
                </AnimatePresence>
              </div>

              {/* Description */}
              <AnimatePresence mode="wait">
                <div className='flex-1 relative rounded-2xl'>
                  {/* Outer border container with corner accents */}
                  <div className="relative card-wrapper p-[3px] rounded-lg ">
                    <div className='...'></div>
                    {/* Inner content box */}
                    <div className="card-content radial-bg-dark p-6 md:p-10 rounded-lg relative overflow-hidden">
                      {/* Corner decorations 
                      <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#00FF00] rounded-tl-lg"></div>
                      <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#00FF00] rounded-tr-lg"></div>
                      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#00FF00] rounded-bl-lg"></div>
                      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#00FF00] rounded-br-lg"></div>
                       */}
                      
                      <motion.div
                        key={`desc-${currentIndex}`}
                        className="relative z-10 "
                        initial={{
                          opacity: 0,
                          y: direction === 'next' ? -70 : 70,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        exit={{
                          opacity: 0,
                          y: direction === 'next' ? 70 : -70,
                        }}
                        transition={{ duration: 0.5, ease: [0.45, 0, 0.55, 1], delay: 0.1 }}
                      >
                        {/* Title with tech styling */}
                        <div className="mb-6 relative ">
                         
                          <motion.h2
                            className="text-3xl font-black text-[#00FF00]/90 text-center tracking-wider uppercase"
                            style={{
                              textShadow: '0 0 20px rgba(0, 255, 0, 0.6), 0 2px 4px rgba(0, 0, 0, 0.8)',
                            }}
                          >
                            {currentSeries.name}
                          </motion.h2>
                         
                        </div>

                        {/* Description text */}
                        <p className="text-gray-200 text-sm md:text-base leading-relaxed max-w-2xl text-justify">
                          {currentSeries.description}
                        </p>

                       
                      </motion.div>
                    </div>
                  </div>
                </div>
              </AnimatePresence>

            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="mt-1 md:mt-12 mb-4 flex gap-5 justify-center">
            <motion.button
              onClick={handlePrev}
              className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-green-500/50 flex items-center justify-center text-green-400 shadow-lg z-10 group"
              whileHover={{ scale: 1.1, borderColor: 'rgba(0, 255, 0, 0.8)' }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 group-hover:drop-shadow-[0_0_8px_rgba(0,255,0,0.8)]" />
            </motion.button>

            <motion.button
              onClick={handleNext}
              className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-green-500/50 flex items-center justify-center text-green-400 shadow-lg z-10 group"
              whileHover={{ scale: 1.1, borderColor: 'rgba(0, 255, 0, 0.8)' }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronRight className="w-6 h-6 md:w-8 md:h-8 group-hover:drop-shadow-[0_0_8px_rgba(0,255,0,0.8)]" />
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
}