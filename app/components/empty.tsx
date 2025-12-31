'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const NUM_DOTS = 15;
export default function Background() {

    const [dotProps, setDotProps] = useState<
    { left: number; top: number; duration: number; delay: number }[]
  >([]);

  useEffect(() => {
    const props = Array.from({ length: NUM_DOTS }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 2 + Math.random() * 2,
      delay: Math.random() * 2,
    }));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDotProps(props);
  }, []);

return (
    <div className="fixed inset-0 bg-black w-full h-full overflow-hidden -z-10">
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Glow filter for energy lines */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="0.6" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Central Omnitrix symbol 
        <g transform="translate(50, 50)">
          <motion.circle
            cx="0"
            cy="0"
            r="5"
            fill="none"
            stroke="#00ff00"
            strokeWidth="0.8"
            filter="url(#glow)"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: [0.8, 1, 0.8],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.circle
            cx="0"
            cy="0"
            r="3"
            fill="none"
            stroke="#00ff00"
            strokeWidth="0.5"
            filter="url(#glow)"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </g> */}

        {/* Top left circuit pattern 
        <g>
          <motion.path
            d="M 20,10.5 L 10,20 L 23,33"
            fill="none"
            stroke="#00ff00"
            strokeWidth="0.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.8 }}
            transition={{ duration: 1.5, delay: 0.3 }}
          />
          <motion.path
            d="M 20,18 L 30,18 L 35,23"
            fill="none"
            stroke="#00ff00"
            strokeWidth="0.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.7 }}
            transition={{ duration: 1.5, delay: 0.5 }}
          />
          <motion.path
            d="M 28,18 L 28,12 L 32,8"
            fill="none"
            stroke="#00ff00"
            strokeWidth="0.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.6 }}
            transition={{ duration: 1.5, delay: 0.7 }}
          />
        </g>*/}

        {/* Top right circuit pattern 
        <g>
          <motion.path
            d="M 80,10.5 L 90,20 L 77,33"
            fill="none"
            stroke="#00ff00"
            strokeWidth="0.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.8 }}
            transition={{ duration: 1.5, delay: 0.3 }}
          />
          <motion.path
            d="M 80,18 L 70,18 L 65,23"
            fill="none"
            stroke="#00ff00"
            strokeWidth="0.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.7 }}
            transition={{ duration: 1.5, delay: 0.5 }}
          />
          <motion.path
            d="M 72,18 L 72,12 L 68,8"
            fill="none"
            stroke="#00ff00"
            strokeWidth="0.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.6 }}
            transition={{ duration: 1.5, delay: 0.7 }}
          />
        </g> */}

        {/* Left side circuit */}
        <g>
          <motion.path
            d="M 0,35 L 22,35 L 45,48"
            fill="none"
            stroke="#00ff00"
            strokeWidth="0.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.8 }}
            transition={{ duration: 1.5, delay: 0.4 }}
          />
          <motion.path
            d="M 10,35 L 10,45 L 25,52"
            fill="none"
            stroke="#00ff00"
            strokeWidth="0.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.7 }}
            transition={{ duration: 1.5, delay: 0.6 }}
          />
        </g>

        {/* Right side circuit */}
        <g>
          <motion.path
            d="M 100,35 L 78,35 L 55,48"
            fill="none"
            stroke="#00ff00"
            strokeWidth="0.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.8 }}
            transition={{ duration: 1.5, delay: 0.4 }}
          />
          <motion.path
            d="M 90,35 L 90,45 L 75,52"
            fill="none"
            stroke="#00ff00"
            strokeWidth="0.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.7 }}
            transition={{ duration: 1.5, delay: 0.6 }}
          />
        </g>

        {/* Bottom left circuit */}
        <g>
          {/*<motion.path
            d="M 0,59 L 15,63 L 25,58"
            fill="none"
            stroke="#00ff00"
            strokeWidth="0.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.8 }}
            transition={{ duration: 1.5, delay: 0.8 }}
          />*/}
          <motion.path
            d="M 8,75 L 8,75 L 30,70 L 47,55"
            fill="none"
            stroke="#00ff00"
            strokeWidth="0.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.8 }}
            transition={{ duration: 1.5, delay: 0.9 }}
          />
          {/*<motion.path
            d="M 12,70 L 18,70 L 18,65"
            fill="none"
            stroke="#00ff00"
            strokeWidth="0.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.6 }}
            transition={{ duration: 1.5, delay: 1.1 }}
          />*/}
        </g>

        {/* Bottom right circuit */}
        <g>
          {/*<motion.path
            d="M 100,59 L 85,63 L 75,58"
            fill="none"
            stroke="#00ff00"
            strokeWidth="0.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.8 }}
            transition={{ duration: 1.5, delay: 0.8 }}
          />*/}
          <motion.path
            d="M 92,75 L 92,75 L 70,70 L 53,55"
            fill="none"
            stroke="#00ff00"
            strokeWidth="0.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.8 }}
            transition={{ duration: 1.5, delay: 0.9 }}
          />
          {/*<motion.path
            d="M 88,70 L 82,70 L 82,65"
            fill="none"
            stroke="#00ff00"
            strokeWidth="0.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.6 }}
            transition={{ duration: 1.5, delay: 1.1 }}
          />*/}
        </g>

        {/* Central connecting lines */}
        <motion.path
          d="M 50,30 L 50,45"
          fill="none"
          stroke="#00ff00"
          strokeWidth="0.5"
          strokeLinecap="round"
          filter="url(#glow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.5 }}
          transition={{ duration: 1.5, delay: 1 }}
        />
        <motion.path
          d="M 50,55 L 50,75"
          fill="none"
          stroke="#00ff00"
          strokeWidth="0.5"
          strokeLinecap="round"
          filter="url(#glow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.5 }}
          transition={{ duration: 1.5, delay: 1.2 }}
        />
      </svg>

      {/* Animated energy particles */}
      <div className="absolute inset-0 pointer-events-none">
        {dotProps.map((props, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 bg-[#00FF00] rounded-full"
            style={{
              left: `${props.left}%`,
              top: `${props.top}%`,
              filter: 'blur(1px)',
            }}
            animate={{
              opacity: [0, 2, 0],
              scale: [0, 1.6, 0],
            }}
            transition={{
              duration: props.duration,
              repeat: Infinity,
              delay: props.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}