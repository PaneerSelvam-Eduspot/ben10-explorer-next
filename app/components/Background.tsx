'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function Background() {
  const [stars, setStars] = useState<{
    size: number;
    x: number;
    y: number;
    delay: number;
    duration: number;
    opacity: number;
    twinkleSpeed: number;
  }[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Generate random stars
    setStars(
      Array.from({ length: 100 }).map(() => ({
        size: Math.random() * 3 + 1, // Stars between 1-4px
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 5,
        duration: Math.random() * 3 + 2, // Twinkle duration
        opacity: Math.random() * 0.8 , // Base opacity
        twinkleSpeed: Math.random() * 2 + 1,
      }))
    );
    setReady(true);
  }, []);

  if (!ready) return null;

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-black">
      {/* Deep space background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950 to-black" />

      {/* Twinkling stars */}
      <div className="absolute inset-0">
        {stars.map((star, i) => (
          <motion.div
            key={`star-${i}`}
            className="absolute rounded-full bg-white"
            style={{
              width: star.size,
              height: star.size,
              left: `${star.x}%`,
              top: `${star.y}%`,
              boxShadow: `0 0 ${star.size * 2}px rgba(255, 255, 255, 0.8)`,
            }}
            animate={{
              opacity: [star.opacity, star.opacity + 0.5, star.opacity],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: star.twinkleSpeed,
              delay: star.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Distant nebula glow (subtle green tint for Ben 10 theme) */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 30% 40%, rgba(0, 255, 0, 0.03) 0%, transparent 50%), radial-gradient(ellipse at 70% 60%, rgba(100, 200, 255, 0.02) 0%, transparent 50%)",
        }}
        animate={{
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Shooting stars */}
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={`shooting-star-${i}`}
          className="absolute h-0.5 bg-gradient-to-r from-white via-white to-transparent"
          style={{
            width: Math.random() * 100 + 50,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            rotate: "-45deg",
            filter: "blur(0.5px)",
          }}
          animate={{
            x: [0, 300],
            y: [0, 300],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            delay: i * 4 + Math.random() * 3,
            repeat: Infinity,
            repeatDelay: 10,
            ease: "easeOut",
          }}
        />
      ))}

    

      {/* Distant star clusters */}
      {Array.from({ length: 5 }).map((_, i) => {
        const clusterX = Math.random() * 100;
        const clusterY = Math.random() * 100;
        return (
          <motion.div
            key={`cluster-${i}`}
            className="absolute"
            style={{
              left: `${clusterX}%`,
              top: `${clusterY}%`,
            }}
          >
            {Array.from({ length: 5 }).map((_, j) => (
              <motion.div
                key={`cluster-star-${j}`}
                className="absolute w-1 h-1 bg-white/60 rounded-full"
                style={{
                  left: `${(Math.random() - 0.5) * 40}px`,
                  top: `${(Math.random() - 0.5) * 40}px`,
                }}
                animate={{
                  opacity: [0.3, 0.7, 0.3],
                }}
                transition={{
                  duration: 3,
                  delay: j * 0.1 + i * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </motion.div>
        );
      })}

      {/* Subtle green tint overlay for Ben 10 theme */}
      <div className="absolute inset-0 bg-gradient-to-b from-green-950/5 via-transparent to-green-950/5 pointer-events-none" />
    </div>
  );
}




{/*function TypewriterText({ text }: { text: string }) {
  const [displayedText, setDisplayedText] = useState("");
  const textRef = useRef(text);
  const indexRef = useRef(0);

  // Keep textRef pointing at the LATEST text every render,
  // without restarting the interval below.
  textRef.current = text; // what should this always equal?

  useEffect(() => {
    const interval = setInterval(() => {
      if (indexRef.current < textRef.current.length) {
        indexRef.current += 1;
        setDisplayedText(textRef.current.slice(0, indexRef.current));  // how much of the string, up to where?
      }
    }, 20); // ~20ms per character — tweak to taste

    return () => clearInterval(interval);
  }, []); // empty array — set up ONCE, never restart

  return <p className="text-sm whitespace-pre-wrap break-words">{displayedText}</p>;
}*/}