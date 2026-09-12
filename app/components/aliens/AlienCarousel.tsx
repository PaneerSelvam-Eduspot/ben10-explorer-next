import { useAliens } from "@/lib/Store";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const wrap = (n: number, length: number) => ((n % length) + length) % length;

export default function AlienCarousel() {
    const [startIndex, setStartIndex] = useState(0);
    const router = useRouter();
    const { allAliens = [] } = useAliens();
    const [direction, setDirection] = useState(1);
    const [isMobile, setIsMobile] = useState(false);
     
    useEffect(() => {
     const mql = window.matchMedia('(max-width: 767px)');
     setIsMobile(mql.matches);

    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
     mql.addEventListener('change', handler);
     return () => mql.removeEventListener('change', handler)
    }, [])

    const visibleCount = isMobile ? 3 : 5;
    
    const visibleAliens = useMemo(() => {
        if (!allAliens || allAliens.length === 0 ) return [];

        return Array.from({ length: visibleCount }).map((aliens, i) => 
      allAliens[wrap(startIndex + i, allAliens.length)]
    )
    }, [allAliens, startIndex, visibleCount]);

    const handleNext = () => {
        setDirection(1)
        setStartIndex((prev) => (prev + 1) % allAliens.length);
    }

    const handlePrev = () => {
        setDirection(-1)
        setStartIndex((prev) => (prev - 1 + allAliens.length) % allAliens.length);
    }

    const cardVariants = {
    enter: (dir: number) => ({ opacity: 0, x: dir * 60 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: -dir * 60 }),
   }

    const centerIndex = Math.floor(visibleCount / 2);

    return(
        <div className="h-full w-full">
            <div className="flex justify-between mb-10">
            <button
            className="text-[#00FF00] text-xl md:text-3xl xl:text-3xl font-bold px-4 hover:text-[#00FF00] transition"
            onClick={handlePrev}
            >⮜</button>
            <button 
            className="text-[#00FF00] text-xl md:text-3xl xl:text-3xl font-bold px-4 hover:text-[#00FF00] transition"
            onClick={handleNext} 
            >⮞</button>
            </div>
            <div className="flex flex-row gap-8 justify-center items-center">
          <AnimatePresence mode="popLayout" initial={false}>      
            {visibleAliens.map((alien, i) => {
                const isFeatured = i === centerIndex;
            return (    
             <motion.div 
              key={alien.id}
              layout="position"
              variants={cardVariants}
              custom={direction}
              initial="enter"
              animate="center"
              exit="exit"
              whileHover={{ y: -8}}
              transition={{ layout: { duration: 0.4, ease: 'easeInOut' }, opacity: { duration: 0.3 }, x: { duration: 0.3 }, y: {duration: 0.2} }}
              className="w-34 md:w-46 flex-shrink-0 flex justify-center cursor-pointer"
              onClick={() => router.push(`/alien/${encodeURIComponent(alien.name)}`)}
              >
             <div className={`p-1 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,255,0,0.5)]
                ${ isFeatured ? 'scale-125 z-10' : 'scale-90 opacity-70 hover:scale-100 hover:opacity-100 hover:z-20' }`}>
              <div className="radial-bg-dark flex flex-col items-center p-4">
                <Image
                 className={`rounded-full object-contain border-2 border-[#00FF00]/70 p-2 
                    ${ isFeatured ? 'w-28 h-28 md:w-34 md:h-34' : 'w-18 h-18 md:w-26 md:h-26'
                  }`}
                 src={alien.image}
                 alt={alien.name}
                 width={128}
                 height={128}
                 sizes="(max-width: 768px) 20vw, 128px"
                />
                <h3 className="text-white font-bold mt-1">{alien.name}</h3>
                {isFeatured && (
                    <div className="text-xs text-gray-300 mt-2 text-center">
                        <p>{alien.species}</p>
                    </div>
                )}
                </div>
              </div>
              </motion.div>
              );
            })}
           </AnimatePresence> 
            </div>
        </div>
    )
}