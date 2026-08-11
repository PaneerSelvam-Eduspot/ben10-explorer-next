'use client';

import { motion } from 'framer-motion';

export default function OmnitrixLoader() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/95 z-50">
      <div className="relative flex items-center justify-center">
        {/* Outer Rotating Ring */}
        <motion.div
          className="absolute w-32 h-32 rounded-full border-4 border-transparent"
          style={{
            borderTopColor: '#00ff00',
            borderRightColor: '#00ff00',
            filter: 'drop-shadow(0 0 20px rgba(0, 255, 0, 0.5))',
          }}
          animate={{ rotate: 360 }}
          transition={{ 
            repeat: Infinity, 
            duration: 3, 
            ease: 'linear' 
          }}
        />

        {/* Middle Rotating Ring - Opposite Direction */}
        <motion.div
          className="absolute w-24 h-24 rounded-full border-2 border-transparent"
          style={{
            borderBottomColor: '#00ff00',
            borderLeftColor: '#00ff00',
            filter: 'drop-shadow(0 0 15px rgba(0, 255, 0, 0.4))',
          }}
          animate={{ rotate: -360 }}
          transition={{ 
            repeat: Infinity, 
            duration: 2, 
            ease: 'linear' 
          }}
        />

        {/* Pulsing Outer Glow */}
        <motion.div
          className="absolute w-40 h-40 rounded-full bg-green-500/10"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: 'easeInOut',
          }}
        />

        {/* Inner Core with Pulse */}
        <motion.div
          className="absolute w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600"
          style={{
            boxShadow: '0 0 40px 10px rgba(0, 255, 0, 0.6), inset 0 0 20px rgba(0, 0, 0, 0.3)',
          }}
          animate={{
            scale: [1, 1.1, 1],
            boxShadow: [
              '0 0 40px 10px rgba(0, 255, 0, 0.6), inset 0 0 20px rgba(0, 0, 0, 0.3)',
              '0 0 60px 20px rgba(0, 255, 0, 0.8), inset 0 0 20px rgba(0, 0, 0, 0.3)',
              '0 0 40px 10px rgba(0, 255, 0, 0.6), inset 0 0 20px rgba(0, 0, 0, 0.3)',
            ],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: 'easeInOut',
          }}
        />

       {/* Omnitrix Symbol/Image - FIXED VERSION */}
<motion.div
  className="absolute flex items-center justify-center z-10"
  animate={{
    opacity: [0.8, 1, 0.8],
  }}
  transition={{
    repeat: Infinity,
    duration: 1.5,
    ease: 'easeInOut',
  }}
>
  <div className="relative w-8 h-8">
    <motion.img 
      src="/ben10-omnitrix.png" 
      alt="Omnitrix Symbol" 
      className="w-full h-full object-cover blur-[1px]"
      style={{
        filter: 'drop-shadow(0 0 10px rgba(0, 255, 0, 0.8))',
        imageRendering: 'crisp-edges',
      }}
      onError={(e) => {
        // Fallback if image fails to load
        const fallback = e.currentTarget.nextElementSibling;
        e.currentTarget.style.display = 'none';
        if (fallback instanceof HTMLElement) {
          fallback.style.display = 'block';
        }
      }}
    />
    {/* SVG Fallback */}
    <div className="absolute inset-0 hidden">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="50" r="45" fill="#00ff00" opacity="0.3"/>
        <circle cx="50" cy="50" r="35" fill="#000000"/>
        <path d="M 50 20 L 35 50 L 50 80 L 65 50 Z" fill="#00ff00"/>
      </svg>
    </div>
  </div>
</motion.div>

        {/* Energy Particles */}
        {[...Array(8)].map((_, i) => {
          const angle = (i * 45 * Math.PI) / 180;
          const radius = 50;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          return (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-green-400 rounded-full"
              style={{
                left: '50%',
                top: '50%',
                filter: 'blur(1px)',
              }}
              animate={{
                x: [0, x, 0],
                y: [0, y, 0],
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
                delay: i * 0.25,
                ease: 'easeInOut',
              }}
            />
          );
        })}
      </div>

      {/* Loading Text 
      <motion.div
        className="mt-12 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }} 
      > 
        <motion.h2 
          className="text-green-400 text-2xl font-bold tracking-wider"
          animate={{
            opacity: [1, 0.6, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: 'easeInOut',
          }}
        >
          SYNCING OMNITRIX DATA
        </motion.h2> */}
        
        {/* Loading Dots 
        <div className="flex justify-center gap-2 mt-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-green-400 rounded-full"
              animate={{
                y: [0, -10, 0],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                repeat: Infinity,
                duration: 1,
                delay: i * 0.2,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </motion.div> */}

      {/* Progress Bar 
      <motion.div
        className="mt-8 w-64 h-1 bg-gray-800 rounded-full overflow-hidden"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8 }}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-green-500 to-green-300"
          style={{
            boxShadow: '0 0 10px rgba(0, 255, 0, 0.8)',
          }}
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: 'easeInOut',
          }}
        />
      </motion.div> */}
    </div>
  );
}
