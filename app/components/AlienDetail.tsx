'use client';
import React, { useEffect, useState } from 'react';
import { useAliens } from '@/lib/Store';
import { useRouter, useParams } from 'next/navigation';
import OmnitrixBackground from './OmnitrixBackground';
import OmnitrixLoader from './OmnitrixLoader';
import { useLoading } from './LoadingProvider';
import { motion } from 'framer-motion';
import ExplorerBackground from './ExplorerBackground';
import Background from './empty';

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

  const navigationList = React.useMemo(() => {
    if (!allAliens || allAliens.length === 0) return [];
    if (!series) return allAliens;
    return allAliens.filter((a) => matchesSeries(a.series, series));
  }, [allAliens, matchesSeries, series]);



    const currentIndex = navigationList.findIndex((a) => a.name.toLowerCase() === decodeURIComponent(String(name)).toLowerCase());
    const alienData = navigationList[currentIndex];

    useEffect(() => {
      if (alienData) {
        // Delay hiding the loader for a smoother transition
        const timer = setTimeout(() => setLoading(false), 500); // 500ms delay
        return () => clearTimeout(timer);
      }
    }, [alienData]);

    if (!alienData && loading) {
      return <OmnitrixLoader />;
    }

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
        {/*<Background />*/}
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

      <div className="radial-bg-dark card-wrapper md:mt-40 xl:mt-0 rounded-2xl p-1 relative xl:w-280 mx-auto">
       <div className='card-content radial-bg-dark p-7 shadow-sm shadow-[#00FF00]'>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8" >
          <div className="flex justify-center">
            <div className='card-wrapper h-70 w-68 p-1'>
            <motion.img 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-68 h-68 rounded-3xl object-contain radial-bg-dark card-content shadow-lg shadow-[#00FF00]  p-4 aspect-square" 
            src={alienData.image || PLACEHOLDER_URL_LARGE} 
            alt={alienData.name} 
            onError={(e) => {
               (e.currentTarget as HTMLImageElement).onerror = null; 
               (e.currentTarget as HTMLImageElement).src = PLACEHOLDER_URL_LARGE; 
               }} 
            />
            </div>
          </div>

          <div className="flex flex-col ">
            <div className="md:text-sm font-light mb-4 ">
              <button className="bg-[#00FF00]/10 px-2 py-1 text-gray-300 text-sm border-2 border-[#00FF00]/50 rounded-md hover:bg-[#00FF00]/20 transition mb-1">
                <span className="font-bold text-[#00FF00]/70">Species:</span> {alienData.species}
                </button> {  } 
                 { }
                <button className="bg-[#00FF00]/10 px-2 py-1 text-gray-300 text-sm border-2 border-[#00FF00]/50 rounded-md hover:bg-[#00FF00]/20 transition">
                <span className="font-bold text-[#00FF00]/70">Homeworld:</span> {alienData.planet}
                </button>
            </div>

            <p className="md:text-xl text-gray-300">{alienData.description}</p>

            <div className="space-y-4 border-t border-gray-200 mt-6 pt-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <span className="md:text-lg font-semibold text-[#00FF00]/70">First Seen:</span>
                <span className="md:text-lg text-gray-300 font-medium">
                  {alienData.firstAppearance} ({alienData.series})
                  </span>
              </div>
            </div>

            <h3 className="md:text-xl font-bold mt-6 pt-4 border-t border-gray-200 text-[#00FF00]/70">Abilities</h3>
            <ul className="grid grid-cols-2 gap-2 text-gray-300 list-disc pl-5">
              {abilitiesList.map((ability) => (
                <li key={ability} className="text-base font-medium">
                  {ability}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      </div>
    </div>
  </div>
  );
}