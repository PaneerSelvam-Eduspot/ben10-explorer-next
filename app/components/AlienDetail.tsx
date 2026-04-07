'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { useAliens } from '@/lib/Store';
import { useRouter, useParams } from 'next/navigation';
import OmnitrixBackground from './OmnitrixBackground';
import OmnitrixLoader from './OmnitrixLoader';
import { useLoading } from './LoadingProvider';
import { motion } from 'framer-motion';
import ExplorerBackground from './ExplorerBackground';
import Background from './empty';
import omnitrix3D from '../../public/omnitrix3D.png';
import AlienBackground from './empty2';
import { Card } from '@/components/ui/card';

const PLACEHOLDER_URL_LARGE = 'https://placehold.co/320x320/059669/FFFFFF?text=OMNITRIX';

export default function AlienDetail({ name }) {
  const [loading, setLoading] = useState(true);
  const { allAliens = [], series } = useAliens();
  const router = useRouter();

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

    useEffect(() => {
      if (alienData) {
        // Delay hiding the loader for a smoother transition
        const timer = setTimeout(() => setLoading(false), 1400); // 500ms delay
        return () => clearTimeout(timer);
      }
    }, [alienData]);

  { /* if (!alienData && loading) {
      return <OmnitrixLoader />;
    }*/}

    if (!alienData)
      return <div className="p-8 text-center text-xl font-semibold text-red-500">Alien data not loaded.</div>;

   

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
    Array.isArray(alienData.abilities) 
     ? alienData.abilities 
     : typeof alienData.abilities === 'string' 
     ? alienData.abilities.split(/,\\s*/) 
     : [];



  return (
    <div className="relative overflow-hidden">
      {loading && <OmnitrixLoader />}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.8 }}
      />
        <Background />

        
   {/**/}  <motion.div 
       className="absolute inset-0"
        initial={{ opacity: 1, zIndex: 50 }}
        animate={{ opacity: !loading ? 0 : 1, zIndex: !loading ? 0 : 50 }}
        transition={{ duration: 1.5 }}
       >
          <AlienBackground transformImg={alienData.transform} />
          {/*<div className='h-[90%] w-[90%] flex items-center justify-center fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
            <motion.img 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-68 h-68 object-contain " 
            src={alienData.image || PLACEHOLDER_URL_LARGE} 
            alt={alienData.name} 
            onError={(e) => {
               (e.currentTarget as HTMLImageElement).onerror = null; 
               (e.currentTarget as HTMLImageElement).src = PLACEHOLDER_URL_LARGE; 
               }} 
            />

              {Array.from({ length: 12 }).map((_, i) => (
                <motion.div
                  key={`beam-${i}`}
                  className="absolute"
                  style={{
                    width: "20px",
                    height: "250px",
                    background: "linear-gradient(to bottom, rgba(0, 255, 0, 0.8), transparent)",
                    transformOrigin: "top center",
                    top: "50%",
                    left: "50%",
                    marginLeft: "-1px",
                    rotate: `${i * 30}deg`,
                    filter: "blur(50px)",
                  }}
                  animate={{
                    opacity: [0.3, 1, 0.3],
                    scaleY: [1, 1.3, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.1,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>*/}
        </motion.div> 
       
        {/*<OmnitrixBackground />
        <ExplorerBackground />*/}
        <div className="p-6 min-h-screen relative z-10">
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

      <div className=" md:mt-40 xl:mt-0 rounded-2xl p-1 relative xl:w-300 mx-auto">
       <div className=' p-7'>
        <div className="flex justify-between items-center mb-6">
          <button 
          onClick={handlePrevious} 
          disabled={isFirst} 
          className={`text-[#00FF00] md:text-3xl font-bold px-4 hover:text-[#00FF00] transition 
          ${isFirst ? 'opacity-30 cursor-not-allowed' : ''}`}
          >
            ⮜
          </button>

          <h2 className="md:text-4xl font-extrabold text-gray-300 text-center">{alienData.name}</h2>

          <button 
          onClick={handleNext} 
          disabled={isLast} 
          className={`text-[#00FF00] md:text-3xl font-bold px-4 hover:text-[#00FF00] transition 
          ${isLast ? 'opacity-30 cursor-not-allowed' : ''}`}
          >
            ⮞
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 z-10" >
          <div className='flex flex-col justify-center'>
            <div className="md:text-sm font-light mb-8 ">
              <button className="bg-[#00FF00]/10 px-2 py-1 text-gray-300 text-sm border-2 border-[#00FF00]/50 rounded-md hover:bg-[#00FF00]/20 transition mb-1">
                <span className="font-bold text-[#00FF00]/70">Species:</span> {alienData.species}
                </button> {  } 
                 { }
                <button className="bg-[#00FF00]/10 px-2 py-1 text-gray-300 text-sm border-2 border-[#00FF00]/50 rounded-md hover:bg-[#00FF00]/20 transition">
                <span className="font-bold text-[#00FF00]/70">Homeworld:</span> {alienData.planet}
                </button>
            </div>

            <Card className="md:text-md p-2 border-[#00FF00]/50 text-gray-300 mb-4">{alienData.description}</Card>

          </div>
          <motion.div className="flex justify-center flex-col items-center "
          style={{
              clipPath: 'polygon(0 0, 100% 0, 85% 51%, 68% 100%, 31% 100%, 14% 49%)',
              
            }}
          >
            <div
            className='h-70 w-68 p-6'
            >
            <motion.img 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transform: 'translateY(-20px)' }}
            transition={{ duration: 0.5 }}
            className="w-68 h-68 rounded-3xl object-contain p-2 aspect-square" 
            src={alienData.image || PLACEHOLDER_URL_LARGE} 
            alt={alienData.name} 
            onError={(e) => { 
               (e.currentTarget as HTMLImageElement).onerror = null;
               (e.currentTarget as HTMLImageElement).src = PLACEHOLDER_URL_LARGE;
               }}
            />
            </div>
            
          </motion.div>

          <div className="flex flex-col ">
            
            <div className="space-y-4  border-gray-200 mt-6 pt-6">
              <div className="flex flex-col sm:flex-row sm:items-center ">
                <span className="md:text-lg font-semibold text-[#00FF00]/70">First Seen:</span>
                <span className="md:text-lg text-gray-300 font-medium">
                  {alienData.firstAppearance} ({alienData.series})
                  </span>
              </div>
            </div>

            <h3 className="md:text-xl font-bold mt-6 pt-4  border-gray-200 text-[#00FF00]/70">Abilities</h3>
            <ul className="grid grid-cols gap-2 text-gray-300 list-disc pl-5">
              {abilitiesList.map((ability) => (
                <li key={ability} className="text-base font-medium">
                  {ability}
                </li>
              ))}
            </ul> 
          </div>
          
        </div>
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center items-center mt-[-100] z-20 ">
              <motion.img
              className='h-125 w-163 object-contain ml-6'
              src='/omnitrixRay2-.png'
              alt='omnitrix'
              />
            </motion.div>
      </div>
      </div>
    </div>
  </div>
  );
}