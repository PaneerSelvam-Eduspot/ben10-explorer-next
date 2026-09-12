'use client';

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function AlienBackground({ transformImg }: { transformImg: string }) {
  const [ready, setReady] = useState(false);
  const [darkSpots] = useState(() =>
    Array.from({ length: 200 }, () => ({
      size: Math.random() * 100 + 40,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 5 + 4,
      delay: Math.random() * 2,
    }))
  );
  console.log('transformImg:', transformImg);
  useEffect(() => {
    setReady(true);
  }, []);



  if (!ready) return null;

  return (
    <div className="fixed inset-0 overflow-hidden bg-black z-[-1]">
      {/* BASE GREEN GRADIENT BACKGROUND */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, #00ff00 0%, #00cc00 20%, #009900 40%, #006600 60%, #003300 80%, #000000 100%)",
        }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* BRIGHT CENTER GLOW */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle, rgba(0, 255, 0, 0.6) 0%, rgba(0, 255, 0, 0.3) 30%, transparent 70%)",
          filter: "blur(60px)",
        }}
        animate={{ opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* DARK SPOTS/SHADOWS */}
      <div className="absolute inset-0">
        {darkSpots.map((spot, i) => {
          return (
            <motion.div
              key={`dark-${i}`}
              className="absolute rounded-full"
              style={{
                width: spot.size,
                height: spot.size,
                left: `${spot.x}%`,
                top: `${spot.y}%`,
                background: "radial-gradient(circle, rgba(0, 50, 0, 0.6), transparent 100%)",
              }}
              animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
              transition={{
                duration: spot.duration,
                delay: spot.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          );
        })}
      </div>

      {/* ENERGY RAYS FROM CENTER */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {Array.from({ length: 16 }).map((_, i) => (
          <motion.div
            key={`beam-${i}`}
            className="absolute"
            style={{
              width: "3px",
              height: "40%",
              background: "linear-gradient(to bottom, rgba(100, 255, 100, 0.8), rgba(0, 255, 0, 0.4), transparent)",
              transformOrigin: "top center",
              top: "50%",
              left: "50%",
              marginLeft: "-1.5px",
              rotate: `${i * 22.5}deg`,
              filter: "blur(2px)",
            }}
            animate={{ opacity: [0.4, 1, 0.4], scaleY: [0.8, 1.2, 0.8] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.1, ease: "easeInOut" }}
          />
        ))}
      </div>

      {/* PULSING ENERGY RINGS */}
      {[0, 0.6, 1.2].map((delay, index) => (
        <motion.div
          key={`ring-${index}`}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-green-400/60"
          style={{
            width: "200px",
            height: "200px",
            boxShadow: "0 0 30px rgba(0, 255, 0, 0.5), inset 0 0 30px rgba(0, 255, 0, 0.3)",
          }}
          animate={{ scale: [1, 2.5, 2.5], opacity: [0.8, 0.4, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: delay, ease: "easeOut" }}
        />
      ))}

      {/* BRIGHT CENTER CORE */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: "200px",
          height: "200px",
          background: "radial-gradient(circle, rgba(200, 255, 200, 0.9), rgba(0, 255, 0, 0.6) 40%, transparent 70%)",
          boxShadow: "0 0 80px rgba(0, 255, 0, 0.8)",
          filter: "blur(5px)",
        }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* CURRENT ALIEN TRANSFORM */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center">
        <motion.div
          key={transformImg}
          
          className="relative"
          initial={{ opacity: 0.8, scale: 0.8 }}
          animate={{ opacity: 1, scale: [1, 1.10, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          
          <motion.img
            src={transformImg}
            crossOrigin="anonymous"
            alt="AlienTransformImage"
            loading="eager"
            height={360}
            width={360}
            className="object-contain"
          />
          
        </motion.div>
        
      </div>
 
      {/* VIGNETTE OVERLAY */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/60 pointer-events-none" />
    </div>
  );
}






