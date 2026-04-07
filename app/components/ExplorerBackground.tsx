'use client';

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";


export default function ExplorerBackground() {

 const [blobs, setBlobs] = useState<{
    size: number;
    x: number;
    y: number;
    delay: number;
    duration: number;
    scale: number;
  }[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setBlobs(
      Array.from({ length: 45 }).map(() => ({
        size: Math.random() * 120 + 40,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 4,
        duration: Math.random() * 10 + 6,
        scale: Math.random() * 0.6 + 0.7,
      }))
    );
    setReady(true);
  }, []);

  if (!ready) return null; // Prevent SSR mismatch



  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-black">
      {/* BACK GREEN GLOW CLOUD */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at center, #39ff14 0%, #1f720a 40%, #003300 80%)",
          filter: "blur(40px) brightness(1.2)",
        }}
        animate={{
          scale: [1, 1.03, 1],
          opacity: [1, 0.95, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* MOVING ENERGY PARTICLES */}
      <div className="absolute inset-0">
        {blobs.map((b, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-black "
            style={{
              width: b.size,
              height: b.size,
              left: `${b.x}%`,
              top: `${b.y}%`,
              filter: "blur(1px)",
            }}
            animate={{
              y: ["0%", "-40%", "0%"],
              x: ["0%", "5%", "-3%", "0%"],
              scale: [b.scale, b.scale + 0.3, b.scale],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: b.duration,
              delay: b.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* LIGHT RAYS (subtle effect like Omnitrix burst) */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "conic-gradient(from 90deg, rgba(0,255,0,0.15), transparent 70%)",
          mixBlendMode: "screen",
          filter: "blur(40px)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}
