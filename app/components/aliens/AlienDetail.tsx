'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useAliens } from '@/lib/Store';
import { useRouter} from 'next/navigation';
import OmnitrixLoader from '../shared/OmnitrixLoader';
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from 'framer-motion';
import AlienBackground from '../backgrounds/Alienbackground';
import {CardDescription } from '@/components/ui/card';
import ExplorerBackground from '../backgrounds/ExplorerBackground';
import Image from 'next/image';
import dynamic from 'next/dynamic';




const PLACEHOLDER_URL_LARGE = 'https://placehold.co/320x320/059669/FFFFFF?text=OMNITRIX';

const AlienCarousel = dynamic(() => import('../aliens/AlienCarousel'), {
  loading: () => <div className='h-40'/>
})

type AlienDetailProps = {
  name: string;
};

  function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  function getAnchorPoint(
    labelRect: DOMRect,
    alienRect: DOMRect,
    containerRect: DOMRect,
    side: 'left' | 'right'
  ) {
    const y = labelRect.top + labelRect.height / 2;
    let clampedY = clamp(y, alienRect.top, alienRect.bottom);
    let x = side === 'left' ? alienRect.left : alienRect.right;
    x = x - containerRect.left;
    clampedY = clampedY - containerRect.top;
    return {x, clampedY};
  }

export default function AlienDetail({ name }: AlienDetailProps) {
  const [loading, setLoading] = useState(true);
  const { allAliens = [], series } = useAliens();
  const router = useRouter();
  const gridRef = useRef<HTMLDivElement>(null);
  
  const { scrollY } = useScroll();
  const smoothScrollY = useSpring(scrollY, {
    stiffness: 100, 
    damping: 30,
    mass: 0.8
  })
const beamOpacity = useTransform(smoothScrollY, [100, 400], [1, 0]);
const alienOpacity = useTransform(smoothScrollY, [50, 150], [1, 0]);
const alienY = useTransform(smoothScrollY, [50, 250], [0, 50]);
const infoOpacity = useTransform(smoothScrollY, [0, 100], [1, 0]);
const speciesRef = useRef<HTMLDivElement>(null);
const descriptionRef = useRef<HTMLDivElement>(null);
const firstSeenRef = useRef<HTMLDivElement>(null);
const abilitiesRef = useRef<HTMLDivElement>(null);
const containerRef = useRef<HTMLDivElement>(null);
  

  const normalize = (s?: string) => (s || '').toLowerCase().replace(/[-_]/g, ' ').trim();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const matchesSeries = (alienSeries: string, selected: string) => {
    if (!selected) return true;
    const a = normalize(alienSeries);
    const sel = normalize(selected);
    if (sel.includes('classic')) return a.includes('classic');
    if (sel.includes('alien') && sel.includes('force')) 
      return a.includes('alien force') || a.includes('alien-force') || a.includes('alienforce');
    if (sel.includes('ultimate')) return a.includes('ultimate');
    return a.includes(sel);
  };

  const navigationList = useMemo(() => {
    if (!allAliens || allAliens.length === 0) return [];
    if (!series) return allAliens;
    return allAliens.filter((a) => matchesSeries(a.series, series));
  }, [allAliens, matchesSeries, series]);


    const currentIndex = navigationList.findIndex((a) => a.name.toLowerCase() === decodeURIComponent(String(name)).toLowerCase());
    const alienData = navigationList[currentIndex];
    const alienRef = useRef<HTMLDivElement>(null);
    const watchRef = useRef<HTMLDivElement>(null);
    const [beamOffset, setBeamOffset] = useState(0);
    const [lines, setLines] = useState<{x1: number, y1: number, x2: number, y2:number}[]>([]);
    

    useEffect(() => {
      if (alienData) {
        // Delay hiding the loader for a smoother transition
        window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
        setLoading(true);
        const timer = setTimeout(() => setLoading(false), 1400); // 500ms delay
        return () => clearTimeout(timer);
      }
    }, [alienData]);


  useEffect(() => {
    if (!navigationList.length) return;

    const preloadUrls: string[] = [];
    if (currentIndex + 1 < navigationList.length) {
      preloadUrls.push(navigationList[currentIndex + 1].transform);
    }
    if (currentIndex - 1 >= 0) {
      preloadUrls.push(navigationList[currentIndex - 1].transform);
    }

    const links: HTMLLinkElement[] = [];
    preloadUrls.forEach((url) => {
      if (!url) return;
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = url;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
      links.push(link);
    })

    return () => {
      links.forEach((link) => document.head.removeChild(link));
    };
  }, [currentIndex, navigationList]);


    const measureLines = () => {
      if(alienRef.current && watchRef.current && containerRef.current && speciesRef.current && descriptionRef.current && firstSeenRef.current && abilitiesRef.current) {
      const alienRect = alienRef.current.getBoundingClientRect();
      const watchRect = watchRef.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      const speciesRect = speciesRef.current.getBoundingClientRect();
      const descriptionRect = descriptionRef.current.getBoundingClientRect();
      const firstSeenRect = firstSeenRef.current.getBoundingClientRect();
      const abilitiesRect = abilitiesRef.current.getBoundingClientRect();
      

      const watchCenter = watchRect.left + watchRect.width / 2;
      const alienCenter = alienRect.left + alienRect.width / 2;
      const hOffset = watchCenter - alienCenter;

      setBeamOffset(hOffset);

      const speciesLineX = (speciesRect.left +  speciesRect.width) - containerRect.left;
      const speciesLineY = (speciesRect.top + speciesRect.height / 2) - containerRect.top;
      const speciesAnchor = getAnchorPoint(speciesRect, alienRect, containerRect, 'left');

      const descriptionX = (descriptionRect.left + descriptionRect.width) - containerRect.left;
      const descriptionY = (descriptionRect.top + descriptionRect.height / 2) - containerRect.top; 
      const descriptionAnchor = getAnchorPoint(descriptionRect, alienRect, containerRect, 'left');

      const firstSeenX = firstSeenRect.left  - containerRect.left;
      const firstSeenY = (firstSeenRect.top + firstSeenRect.height / 2) - containerRect.top;
      const firstSeenAnchor = getAnchorPoint(firstSeenRect, alienRect, containerRect, 'right');

      const abilitiesX = abilitiesRect.left - containerRect.left;
      const abilitiesY = (abilitiesRect.top + abilitiesRect.height / 2) - containerRect.top;
      const abilitiesAnchor = getAnchorPoint(abilitiesRect, alienRect, containerRect, 'right');


      const speciesLine = { x1: speciesLineX, y1: speciesLineY, x2: speciesAnchor.x, y2: speciesAnchor.clampedY };
      const descriptionLine = {x1: descriptionX, y1: descriptionY, x2: descriptionAnchor.x, y2: descriptionAnchor.clampedY};
      const firstSeenLine = {x1: firstSeenX, y1: firstSeenY, x2: firstSeenAnchor.x, y2: firstSeenAnchor.clampedY};
      const abilitiesLine = {x1: abilitiesX, y1: abilitiesY, x2: abilitiesAnchor.x, y2: abilitiesAnchor.clampedY};

      setLines([speciesLine, descriptionLine, firstSeenLine, abilitiesLine]);
    }
    }

    const autoScroll = () => {
      if(watchRef.current){
        const watchRect = watchRef.current.getBoundingClientRect();
        const elementTop = watchRect.top + window.scrollY;
        window.scrollTo({ top: elementTop, behavior: 'smooth' })
      }
    }

    useEffect(() => {
     measureLines();
     window.addEventListener("resize", measureLines);
     return () => {
      window.removeEventListener("resize", measureLines);
     }
    }, [alienData, loading]);


    const [isMobile, setIsMobile] = useState(false);
    
    useEffect(() => {
      const mql = window.matchMedia('(max-width: 767px), (max-height: 700px)');
      setIsMobile(mql.matches);

      const handler = (e:MediaQueryListEvent) => setIsMobile(e.matches);
      mql.addEventListener('change', handler);
      return () => mql.removeEventListener('change', handler)
    }, [])


    const handleAnimationComplete = () => {
      measureLines();
      if (isMobile) autoScroll();
    }

    const handleNext = () => {
      if ( currentIndex < navigationList.length - 1) {
        const nextAlien = navigationList[currentIndex + 1].name;
        router.replace(`/alien/${encodeURIComponent(nextAlien)}`);
      }
    };

    const handlePrevious = () => {
      if (currentIndex > 0) {
      const prevAlien = navigationList[currentIndex - 1].name;
      router.replace(`/alien/${encodeURIComponent(prevAlien)}`);
    }};

    const isFirst = currentIndex <= 0;
    const isLast = currentIndex >= navigationList.length - 1;

    const abilitiesList = 
    alienData ? (Array.isArray(alienData.abilities) 
     ? alienData.abilities 
     : typeof alienData.abilities === 'string' 
     ? alienData.abilities.split(/,\\s*/) 
     : []
     ) : [];

  return (
    
  <div className="relative overflow-hidden">
    <div ref={gridRef} className={` xl:mt-0 rounded-2xl p-1 relative xl:w-300 mx-auto`}>
    {!alienData ? ( 
      <div className='p-8 text-center text-xl font-semibold text-red-500'>
        Alien data not loaded.
      </div>
    ) : (
      <>
      {loading && <OmnitrixLoader />}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.8 }}
      />
      <div className='absolute inset-0 bg-zinc-700 overflow-hidden z-0 opacity-10'>
         <ExplorerBackground />
       </div>

  <AnimatePresence>
    {loading && (
      <motion.div 
       className="absolute inset-0"
        initial={{ opacity: 1, zIndex: 50 }}
        animate={{ opacity: 1, zIndex: 50 }}
        exit={{ opacity: 0, zIndex: 0}}
        transition={{ duration: 1.5 }}
       >
          <AlienBackground transformImg={alienData.transform} />
      </motion.div> 
    )}    
  </AnimatePresence>      
       
        <div className={`md:min-h-screen p-6 relative z-10`}>
          <button
            onClick={() =>  router.back()}
            className="inline-block bg-transparent border-none p-0 cursor-pointer focus:outline-none"
          >
        <h1 
        className="text-2xl font-bold mb-6 text-white md:mt-5 xl:mt-0 hover:text-[#00FF00] transition border-b border-transparent hover:border-[#00FF00]/60 w-max"
        >
          &lt; Back
        </h1>
      </button>
      

      <div 
      className={` xl:mt-0 rounded-2xl p-1 relative xl:w-300 mx-auto`}
      >
       <div className=' p-7'>
        <div className="flex justify-between items-center mb-6">
          <button 
          onClick={handlePrevious} 
          disabled={isFirst} 
          className={`text-[#00FF00] text-xl md:text-2xl xl:text-3xl font-bold px-4 hover:text-[#00FF00] transition 
          ${isFirst ? 'opacity-30 cursor-not-allowed' : ''}`}
          >
            ⮜
          </button>

          <h2 className="text-2xl md:text-3xl xl:text-4xl font-extrabold text-gray-300 text-center">{alienData.name}</h2>

          <button 
          onClick={handleNext} 
          disabled={isLast} 
          className={`text-[#00FF00] text-xl md:text-3xl xl:text-3xl font-bold px-4 hover:text-[#00FF00] transition 
          ${isLast ? 'opacity-30 cursor-not-allowed' : ''}`}
          >
            ⮞
          </button>
        </div>
        

        <motion.div 
        className={`min-[880px]:mt-50 xl:mt-0 relative grid grid-cols-1 md:grid-cols-3 gap-8 z-10`}
        style={{opacity: isMobile ? 1 : infoOpacity}}
        ref={containerRef}
        >
      {/*  <svg
          className='hidden md:block'
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}
        >
          {lines.map((line, i) => (
            <line
              key={i}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="rgba(0, 255, 0, 0.6)"
              strokeWidth={1.5}
            />
          ))}
        </svg>*/}
          <motion.div 
          initial={{ scale: 0, y: -20 }}
          animate={{ scale: 0.8, y: 0 }}
          transition={{ duration: 0.6, delay: 2.2 }}
          className='flex flex-col justify-center'>
            <div 
            ref={speciesRef}
            className="text-xs md:text-sm xl:text-base font-light md:mb-8 ">
              <button className="bg-[#00FF00]/10 px-2 py-1 text-gray-300 text-sm rounded-md hover:bg-[#00FF00]/20 transition mb-1">
                <span className="font-bold text-[#00FF00]/70">Species:</span> {alienData.species}
                </button> {  } 
                 { }
                <button className="bg-[#00FF00]/10 px-2 py-1 text-gray-300 text-sm  rounded-md hover:bg-[#00FF00]/20 transition">
                <span className="font-bold text-[#00FF00]/70">Homeworld:</span> {alienData.planet}
                </button>
            </div>
           
           <div
           ref={descriptionRef}
           >
            <CardDescription
            className="text-base md:text-lg xl:text-xl p-2 border-[#00FF00]/50 text-gray-300 mt-2 md:mb-4">{alienData.description}</CardDescription>
           </div>
          </motion.div>
          <motion.div className="flex justify-center flex-col items-center order-2 md:order-none"
          style={{
              clipPath: 'polygon(0 0, 100% 0, 85% 51%, 68% 100%, 31% 100%, 14% 49%)',
              opacity: isMobile ? 1 : alienOpacity,
              y : isMobile ? 0 : alienY
            }}
            ref={alienRef}
          >
            <div
            className='w-40 h-40 md:w-56 md:h-56 xl:h-70 xl:w-68 md:p-6 xl:mb-15'
            >
            <Image
            loading='eager'
            className="w-45 h-45 md:w-56 md:h-56 xl:w-68 xl:h-68 rounded-3xl object-contain p-5 aspect-square" 
            src={alienData.image || PLACEHOLDER_URL_LARGE} 
            alt={alienData.name} 
            width={320}
            height={320}
            onError={(e) => { 
               (e.currentTarget as HTMLImageElement).onerror = null;
               (e.currentTarget as HTMLImageElement).src = PLACEHOLDER_URL_LARGE;
               }}
            /> 
            </div>
          </motion.div>
        
          <motion.div 
          className="flex flex-col"
          initial={{ scale: 0, y: -20 }}
          animate={{ scale: 0.8, y: 0 }}
          transition={{ duration: 0.6, delay: 2.2 }}
          >
            <div className="space-y-4 border-gray-200 md:mt-6 pt-6">
              <div 
              ref={firstSeenRef}
              className="flex flex-col sm:flex-row sm:items-center ">
                <span className="text-base md:text-lg xl:text-xl font-semibold text-[#00FF00]/70">First Seen:</span>
                <span className="text-base md:text-lg xl:text-xl text-gray-300 font-medium">
                  {alienData.firstAppearance} ({alienData.series})
                  </span>
              </div>
            </div>
           
           <div
           ref={abilitiesRef}
           >     
             
            <h3
            className="text-lg md:text-xl xl:text-2xl font-bold md:mt-6 pt-4 border-gray-200 text-[#00FF00]/70">Abilities</h3>
            <ul 
            className="grid grid-cols md:gap-2 text-gray-300 list-disc pl-5">
              {abilitiesList.map((ability) => (
                <li key={ability} className="text-base font-medium">
                  {ability}
                </li>
              ))}
            </ul> 
            </div>
          </motion.div>
          
        </motion.div>


        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            ref={watchRef}
            className="flex relative justify-center items-center md:mt-[-100] ">
            <motion.div 
             className='z-20 mt-100'
             style={{
                opacity: isMobile ? 1 : beamOpacity,
                position: "absolute",
                bottom: `60%`,
                left: "50%",
                transform: `translateX(calc(-50% + ${beamOffset}px))`,
                height: "100%",
                width: isMobile ? "250px" : "330px",
                filter: "blur(12px)",
                willChange: 'opacity, transform'
              }}
            >
           
              <motion.div 
              initial={{ scale: 1, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 2 }}
               style={{
                clipPath:'polygon(0 0, 100% 0, 65% 100%, 35% 100%)',
                background: "linear-gradient(to top, rgba(0, 255, 0, 0.8), transparent)",                
                height: "100%",
                filter: "blur(30px)"
               }}
              />
              <motion.div 
              initial={{ scale: 0.8, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className='z-10'
              style={{
                clipPath:"circle(50% at 50% 50%)",
                opacity: isMobile ? 1 : beamOpacity,
                position: "absolute",
                bottom: `10px`,
                left: "50%",
                height:"100px",
                width: isMobile ? "50px" : "100px",
                transform: `translateX(calc(-50% + ${beamOffset}px))`,

                borderRadius: "50%",
                background: "linear-gradient(to top, rgba(0, 255, 0, 0.8), transparent)",
              }}
            />
            </motion.div>
            
              <motion.img
              onAnimationComplete={handleAnimationComplete}
              initial={{ scale: 0.8, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className='w-70 h-70 md:w-88 md:h-88 xl:h-100 xl:w-110 object-cover ml-6 z-1 mt-10'
              src='/omnitrixRay2-.png'
              alt='omnitrix'
              />
        </motion.div>
        <AlienCarousel />
      </div>
      </div>
    </div>
      </>
    )}
    </div>
  </div>
  );
}
