"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Alien {
  _id: string;
  id: number;
  name: string;
  image: string;
  species?: string;
}

interface OmnitrixDirectoryProps {
  aliens: Alien[];
}

export default function OmnitrixDirectory({ aliens }: OmnitrixDirectoryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [ringRotation, setRingRotation] = useState(0);

  const currentAlien = aliens[currentIndex];

  const handleNext = () => {
    if (isTransitioning || !aliens.length) return;
    setDirection('next');
    setIsTransitioning(true);
    setRingRotation(prev => prev + 72);
    
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % aliens.length);
      setIsTransitioning(false);
    }, 800);
  };

  const handlePrevious = () => {
    if (isTransitioning || !aliens.length) return;
    setDirection('prev');
    setIsTransitioning(true);
    setRingRotation(prev => prev - 72);
    
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + aliens.length) % aliens.length);
      setIsTransitioning(false);
    }, 800);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrevious();
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isTransitioning, aliens.length]);

  if (!aliens.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <p className="text-green-400 text-xl">No aliens available</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black flex flex-col items-center justify-center overflow-hidden">
      {/* Background rays - animated during transition */}
      <AnimatePresence mode="wait">
        {isTransitioning && (
          <motion.div
            key={`rays-${currentIndex}`}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute top-1/2 left-1/2 w-2 h-full origin-top"
                style={{
                  background: `linear-gradient(180deg, rgba(212, 255, 0, 0.4) 0%, transparent 60%)`,
                  transform: `rotate(${i * 45 + ringRotation}deg) translateX(-50%)`,
                }}
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: i * 0.04 }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Green glow effect */}
      <motion.div 
        className="absolute inset-0"
        animate={{
          opacity: isTransitioning ? 0.6 : 0.25
        }}
        transition={{ duration: 0.6 }}
        style={{
          background: 'radial-gradient(circle at center, rgba(212, 255, 0, 0.25) 0%, transparent 55%)',
          filter: 'blur(80px)'
        }}
      />

      {/* Title */}
      <motion.h1
        className="text-5xl font-black text-green-400 mb-16 tracking-[0.3em] relative z-10"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          textShadow: '0 0 30px rgba(212, 255, 0, 0.8), 0 0 60px rgba(212, 255, 0, 0.4)',
        }}
      >
        OMNITRIX DIRECTORY
      </motion.h1>

      <div className="relative flex items-center gap-16 z-10">
        {/* Previous Button */}
        <motion.button
          onClick={handlePrevious}
          disabled={isTransitioning}
          className="relative w-20 h-20 rounded-full bg-gradient-to-br from-gray-700/90 to-gray-900/90 backdrop-blur-sm border-2 border-green-500/50 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.1, borderColor: 'rgba(212, 255, 0, 0.8)' }}
          whileTap={{ scale: 0.95 }}
          style={{
            boxShadow: '0 0 25px rgba(212, 255, 0, 0.3)',
          }}
        >
          <ChevronLeft className="text-green-400" size={40} strokeWidth={3} />
        </motion.button>

        {/* Omnitrix Display */}
        <div className="relative w-[520px] h-[520px] flex items-center justify-center">
          {/* Outer rotating ring assembly */}
          <motion.div 
            className="absolute inset-0"
            animate={{ 
              rotate: ringRotation 
            }}
            transition={{ 
              duration: 0.8, 
              ease: [0.45, 0, 0.55, 1]
            }}
          >
            <svg className="w-full h-full" viewBox="0 0 520 520">
              <defs>
                {/* Metallic gradients */}
                <linearGradient id="metalGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6b7280" />
                  <stop offset="30%" stopColor="#9ca3af" />
                  <stop offset="50%" stopColor="#4b5563" />
                  <stop offset="70%" stopColor="#9ca3af" />
                  <stop offset="100%" stopColor="#6b7280" />
                </linearGradient>
                <linearGradient id="metalGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#374151" />
                  <stop offset="50%" stopColor="#6b7280" />
                  <stop offset="100%" stopColor="#374151" />
                </linearGradient>
              </defs>
              
              {/* Outermost ring */}
              <circle
                cx="260"
                cy="260"
                r="235"
                fill="none"
                stroke="url(#metalGrad1)"
                strokeWidth="22"
                opacity="0.95"
              />
              
              {/* Second ring with gap segments */}
              <circle
                cx="260"
                cy="260"
                r="218"
                fill="none"
                stroke="#4b5563"
                strokeWidth="14"
                strokeDasharray="55 18"
                opacity="0.85"
              />
              
              {/* Third ring */}
              <circle
                cx="260"
                cy="260"
                r="206"
                fill="none"
                stroke="url(#metalGrad2)"
                strokeWidth="10"
                opacity="0.9"
              />
              
              {/* Inner decorative ring */}
              <circle
                cx="260"
                cy="260"
                r="195"
                fill="none"
                stroke="#1f2937"
                strokeWidth="5"
                opacity="0.7"
              />

              {/* Segmented outer detail */}
              <circle
                cx="260"
                cy="260"
                r="227"
                fill="none"
                stroke="#9ca3af"
                strokeWidth="4"
                strokeDasharray="28 12"
                opacity="0.6"
              />
            </svg>

            {/* Four indicator buttons on the rotating ring */}
            {[0, 90, 180, 270].map((angle, i) => (
              <motion.button
                key={i}
                className="absolute left-1/2 top-1/2 cursor-pointer"
                style={{
                  transform: `rotate(${angle}deg) translateY(-245px) translateX(-50%)`,
                }}
                onClick={() => i % 2 === 0 ? handleNext() : handlePrevious()}
                whileHover={{ scale: 1.15 }}
                animate={{
                  boxShadow: [
                    '0 0 30px rgba(212, 255, 0, 0.8)',
                    '0 0 45px rgba(212, 255, 0, 1)',
                    '0 0 30px rgba(212, 255, 0, 0.8)',
                  ]
                }}
                transition={{
                  boxShadow: { duration: 2, repeat: Infinity, delay: i * 0.5, ease: "linear" }
                }}
              >
                <div className="relative w-12 h-12">
                  {/* Button outer ring */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 shadow-lg" />
                  {/* Button inner ring */}
                  <div className="absolute inset-[3px] rounded-full bg-gradient-to-br from-gray-800 to-black shadow-inner" />
                  {/* Glowing center */}
                  <div 
                    className="absolute inset-[5px] rounded-full"
                    style={{
                      background: 'radial-gradient(circle at 35% 35%, #d4ff00 0%, #b4dd00 40%, #94bb00 100%)',
                      boxShadow: '0 0 20px rgba(212, 255, 0, 0.9), inset 0 -4px 8px rgba(0, 0, 0, 0.5), inset 0 4px 8px rgba(255, 255, 255, 0.3)',
                    }}
                  />
                  {/* Inner highlight */}
                  <div className="absolute inset-[7px] rounded-full bg-gradient-to-br from-white/40 to-transparent" />
                  {/* Border */}
                  <div className="absolute inset-0 rounded-full border-[3px] border-gray-900/80" />
                </div>
              </motion.button>
            ))}
          </motion.div>

          {/* Static center structure - multi-layered */}
          <div className="absolute inset-[55px]">
            {/* Outermost center ring */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 shadow-2xl">
              {/* Inner shadow ring */}
              <div className="absolute inset-[6px] rounded-full bg-gradient-to-br from-gray-900 via-black to-gray-900 shadow-[inset_0_4px_20px_rgba(0,0,0,0.8)]" />
              
              {/* Multiple decorative rings */}
              <div className="absolute inset-[14px] rounded-full border-2 border-gray-700/60" />
              <div className="absolute inset-[22px] rounded-full border border-gray-600/40" />
              <div className="absolute inset-[28px] rounded-full border border-gray-600/30" />
              
              {/* Inner circular platform */}
              <div className="absolute inset-[35px] rounded-full bg-gradient-to-br from-gray-800 via-gray-900 to-black shadow-[inset_0_-4px_15px_rgba(0,0,0,0.6)]">
                {/* Subtle highlight */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/5 to-transparent" />
              </div>

              {/* Slow Rotating Energy Ring */}
              <motion.div
                className="absolute inset-[40px] rounded-full border-2 border-green-500/20"
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
              />
              
              {/* Center diamond area */}
              <div className="absolute inset-0 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={`diamond-${currentIndex}`}
                    className="relative w-[340px] h-[340px]"
                    initial={{
                      scale: 0.5,
                      rotate: direction === 'next' ? -180 : 180,
                      opacity: 0
                    }}
                    animate={{
                      scale: 1,
                      rotate: 0,
                      opacity: 1
                    }}
                    exit={{
                      scale: 0.5,
                      rotate: direction === 'next' ? 180 : -180,
                      opacity: 0
                    }}
                    transition={{
                      duration: 0.8,
                      ease: [0.45, 0, 0.55, 1]
                    }}
                  >
                    {/* Outer glow layers */}
                    <motion.div 
                      className="absolute inset-[-25px] blur-3xl opacity-60"
                      style={{ 
                        transform: 'rotate(45deg)',
                        background: 'linear-gradient(135deg, rgba(254, 240, 138, 0.5), rgba(212, 255, 0, 0.5), rgba(148, 187, 0, 0.5))'
                      }}
                      animate={{
                        opacity: [0.6, 0.8, 0.6]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    
                    {/* Diamond base shape */}
                    <motion.div 
                      className="absolute inset-0"
                      style={{ 
                        transform: 'rotate(deg)',
                        clipPath: 'polygon(50% 0%, 86% 48%, 50% 100%, 17% 48%) ',
                        background: 'linear-gradient(135deg, #22c55e 0%, #15803d 35%, #16a34a 65%, #166534 100%)',
                        boxShadow: `
                          0 0 60px rgba(212, 255, 0, 0.9),
                          0 0 90px rgba(212, 255, 0, 0.6),
                          inset 0 0 40px rgba(255, 255, 255, 0.25),
                          inset -15px -15px 50px rgba(0, 0, 0, 0.25)
                        `
                      }}
                      animate={{
                        boxShadow: [
                          '0 0 60px rgba(212, 255, 0, 0.9), 0 0 90px rgba(212, 255, 0, 0.6), inset 0 0 40px rgba(255, 255, 255, 0.25), inset -15px -15px 50px rgba(0, 0, 0, 0.25)',
                          '0 0 80px rgba(212, 255, 0, 1), 0 0 110px rgba(212, 255, 0, 0.7), inset 0 0 40px rgba(255, 255, 255, 0.25), inset -15px -15px 50px rgba(0, 0, 0, 0.25)',
                          '0 0 60px rgba(212, 255, 0, 0.9), 0 0 90px rgba(212, 255, 0, 0.6), inset 0 0 40px rgba(255, 255, 255, 0.25), inset -15px -15px 50px rgba(0, 0, 0, 0.25)',
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      {/* Primary light reflection - top left 
                      <div className="absolute top-0 left-0 right-1/2 bottom-1/2 bg-gradient-to-br from-white/50 via-white/20 to-transparent" />
                      {/* Secondary reflection - bottom right 
                      <div className="absolute bottom-0 right-0 left-1/2 top-1/2 bg-gradient-to-tl from-white/20 to-transparent" /> */}
                    </motion.div>

                    {/* Diamond edge highlights 
                    <div 
                      className="absolute inset-0 border-2 border-white/30"
                      style={{ 
                        transform: 'rotate(45deg)',
                        clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                        boxShadow: 'inset 0 0 20px rgba(255, 255, 255, 0.2)'
                      }}
                    />
                    */}

                    {/* Alien Image/Silhouette */}
                    <motion.div 
                      className="absolute inset-0 flex items-center justify-center z-10"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{ duration: 0.4 }}
                    >
                      <img
                        src={currentAlien.image}
                        alt={currentAlien.name}
                        className="w-[50%] h-[50%] object-contain"
                        style={{
                          filter: 'brightness(0) invert(0) saturate(0) drop-shadow(0 0 20px rgba(57, 255, 20, 0.8)) drop-shadow(0 4px 12px rgba(0, 0, 0, 0.9))',
                        }}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </motion.div>

                    {/* Diamond corner accents 
                    <div 
                      className="absolute -top-5 left-1/2 -translate-x-1/2 w-0 h-0"
                      style={{
                        borderLeft: '16px solid transparent',
                        borderRight: '16px solid transparent',
                        borderBottom: '22px solid rgba(254, 240, 138, 0.6)'
                      }}
                    />
                    <div 
                      className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-0 h-0"
                      style={{
                        borderLeft: '16px solid transparent',
                        borderRight: '16px solid transparent',
                        borderTop: '22px solid rgba(254, 240, 138, 0.6)'
                      }}
                    /> */}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Top center button */}
          <motion.div 
            className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20"
            animate={{
              boxShadow: [
                '0 0 35px rgba(212, 255, 0, 0.9)',
                '0 0 50px rgba(212, 255, 0, 1)',
                '0 0 35px rgba(212, 255, 0, 0.9)',
              ]
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          >
            <div className="relative w-14 h-14">
              {/* Button outer ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 shadow-lg" />
              {/* Button middle ring */}
              <div className="absolute inset-[3px] rounded-full bg-gradient-to-br from-gray-800 to-black shadow-inner" />
              {/* Glowing center */}
              <div 
                className="absolute inset-[5px] rounded-full"
                style={{
                  background: 'radial-gradient(circle at 35% 35%, #d4ff00 0%, #b4dd00 40%, #94bb00 100%)',
                  boxShadow: '0 0 25px rgba(212, 255, 0, 1), inset 0 -5px 10px rgba(0, 0, 0, 0.5), inset 0 5px 10px rgba(255, 255, 255, 0.3)',
                }}
              />
              {/* Inner highlight */}
              <div className="absolute inset-[7px] rounded-full bg-gradient-to-br from-white/50 to-transparent" />
              {/* Border */}
              <div className="absolute inset-0 rounded-full border-[3px] border-gray-900/80" />
            </div>
          </motion.div>
        </div>

        {/* Next Button */}
        <motion.button
          onClick={handleNext}
          disabled={isTransitioning}
          className="relative w-20 h-20 rounded-full bg-gradient-to-br from-gray-700/90 to-gray-900/90 backdrop-blur-sm border-2 border-green-500/50 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.1, borderColor: 'rgba(212, 255, 0, 0.8)' }}
          whileTap={{ scale: 0.95 }}
          style={{
            boxShadow: '0 0 25px rgba(212, 255, 0, 0.3)',
          }}
        >
          <ChevronRight className="text-green-400" size={40} strokeWidth={3} />
        </motion.button>
      </div>

      {/* Alien Info */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={`info-${currentIndex}`}
          className="mt-20 text-center relative z-10"
          initial={{ opacity: 0, y: 40, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -40, scale: 0.8 }}
          transition={{ duration: 0.5, ease: [0.45, 0, 0.55, 1] }}
        >
          <motion.h2
            className="text-6xl font-black text-green-400 mb-4 tracking-widest"
            animate={{
              textShadow: [
                '0 0 25px rgba(212, 255, 0, 0.8), 0 0 50px rgba(212, 255, 0, 0.4)',
                '0 0 35px rgba(212, 255, 0, 1), 0 0 70px rgba(212, 255, 0, 0.5)',
                '0 0 25px rgba(212, 255, 0, 0.8), 0 0 50px rgba(212, 255, 0, 0.4)',
              ]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            {currentAlien.name.toUpperCase()}
          </motion.h2>
          
          {currentAlien.species && (
            <p className="text-2xl text-green-400/80 tracking-wider font-medium mb-6">
              {currentAlien.species}
            </p>
          )}

          <div className="flex items-center justify-center gap-4 text-gray-400 text-lg">
            <motion.span
              className="text-green-500 font-bold text-2xl"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ◆
            </motion.span>
            <p className="font-semibold">
              ALIEN {currentIndex + 1} / {aliens.length}
            </p>
            <motion.span
              className="text-green-500 font-bold text-2xl"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            >
              ◆
            </motion.span>
          </div>
          
          {/* Progress indicators */}
          <div className="mt-8 flex gap-3 justify-center">
            {aliens.map((_, index) => (
              <motion.div
                key={index}
                className={`rounded-full transition-all duration-500 cursor-pointer ${
                  index === currentIndex
                    ? 'w-14 h-3.5 bg-green-500'
                    : 'w-3.5 h-3.5 bg-gray-700 hover:bg-gray-600'
                }`}
                animate={index === currentIndex ? {
                  boxShadow: [
                    '0 0 15px rgba(212, 255, 0, 0.7)',
                    '0 0 20px rgba(212, 255, 0, 0.9)',
                    '0 0 15px rgba(212, 255, 0, 0.7)',
                  ]
                } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
                onClick={() => {
                  if (!isTransitioning && index !== currentIndex) {
                    const diff = index - currentIndex;
                    setDirection(diff > 0 ? 'next' : 'prev');
                    setIsTransitioning(true);
                    setRingRotation(prev => prev + (diff * 72));
                    setTimeout(() => {
                      setCurrentIndex(index);
                      setIsTransitioning(false);
                    }, 800);
                  }
                }}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Keyboard hint */}
      <div className="absolute top-10 right-10 text-gray-600 text-sm text-right space-y-1">
        <p className="text-gray-500">Use arrow keys</p>
        <p className="flex items-center gap-3 justify-end text-base">
          <span className="text-green-400">←</span>
          <span className="text-gray-700">|</span>
          <span className="text-green-400">→</span>
        </p>
      </div>
    </div>
  );
}