'use client';
import React from 'react';
import { useAliens } from '@/lib/Store';
import { useRouter,useParams } from 'next/navigation';
import OmnitrixBackground from './OmnitrixBackground';

const PLACEHOLDER_URL_LARGE = 'https://placehold.co/320x320/059669/FFFFFF?text=OMNITRIX';

export default function AlienDetail() {
  const { allAliens = [], series } = useAliens();
  const router = useRouter();
  const { name } = useParams();

  const normalize = (s?: string) => (s || '').toLowerCase().replace(/[-_]/g, ' ').trim();

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
  }, [allAliens, series]);


  const currentIndex = navigationList.findIndex((a) => a.name.toLowerCase() === decodeURIComponent(String(name)).toLowerCase());
  const alienData = navigationList[currentIndex];

  if (!alienData) 
    return <div className="p-8 text-center text-xl font-semibold text-red-500">Alien data not loaded.</div>;

  const handleNext = () => { 
    if ( currentIndex < navigationList.length - 1) {
       const nextAlien = navigationList[currentIndex + 1].name;
      router.push(`/alien/${encodeURIComponent(nextAlien)}`);
 }
};

  const handlePrevious = () => { 
    if (currentIndex > 0) {
    const prevAlien = navigationList[currentIndex - 1].name;
    router.push(`/alien/${encodeURIComponent(prevAlien)}`);
  }};

  const isFirst = currentIndex <= 0;
  const isLast = currentIndex >= navigationList.length - 1;

  const abilitiesList = 
  Array.isArray(alienData.abilities) 
   ? alienData.abilities 
   : typeof alienData.abilities === 'string' 
   ? alienData.abilities.split(/,\s*/) 
   : [];

  return (
  <div className = "relative">
    <OmnitrixBackground /> 
    <div className="p-6  min-h-screen relative z-10">
      <button 
      onClick={() => router.push('/explorer')} 
      className="inline-block bg-transparent border-none p-0 cursor-pointer focus:outline-none"
      >
        <h1 className="text-2xl font-bold mb-6 text-green-700 hover:text-green-500 transition">
          &lt; Back to Explorer
        </h1>
      </button>

      <div className="bg-black border border-green-700 rounded-2xl shadow-green-500 shadow-lg p-8 relative md:w-280 mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button 
          onClick={handlePrevious} 
          disabled={isFirst} 
          className={`text-green-600 md:text-3xl font-bold px-4 hover:text-green-800 transition 
          ${isFirst ? 'opacity-30 cursor-not-allowed' : ''}`}
          >
            ⮜
          </button>

          <h2 className="md:text-4xl font-extrabold text-gray-300 text-center">{alienData.name}</h2>

          <button 
          onClick={handleNext} 
          disabled={isLast} 
          className={`text-green-600 md:text-3xl font-bold px-4 hover:text-green-800 transition 
          ${isLast ? 'opacity-30 cursor-not-allowed' : ''}`}
          >
            ⮞
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex justify-center">
            <img 
            className="w-64 h-64 md:w-80 md:h-80 bg-gray-950 rounded-3xl object-contain border-5 border-green-700 shadow-lg shadow-green-500 p-4 aspect-square" 
            src={alienData.image || PLACEHOLDER_URL_LARGE} 
            alt={alienData.name} 
            onError={(e) => {
               (e.currentTarget as HTMLImageElement).onerror = null; 
               (e.currentTarget as HTMLImageElement).src = PLACEHOLDER_URL_LARGE; 
               }} 
            />
          </div>

          <div className="flex flex-col">
            <div className="md:text-sm font-light mb-4 ">
              <button className="bg-green-100 px-2 py-1 text-gray-800 text-sm border-2 border-green-600 rounded-md hover:bg-green-200 transition mb-1">
                <span className="font-bold text-green-600">Species:</span> {alienData.species}
                </button> {' '} 
                 {' '}
                <button className="bg-green-100 px-2 py-1 text-gray-800 text-sm border-2 border-green-600 rounded-md hover:bg-green-200 transition">
                <span className="font-bold text-green-600">Homeworld:</span> {alienData.planet}
                </button>
            </div>

            <p className="md:text-xl text-gray-300">{alienData.description}</p>

            <div className="space-y-4 border-t border-gray-200 mt-6 pt-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <span className="md:text-lg font-semibold text-green-700">First Seen:</span>
                <span className="md:text-lg text-gray-300 font-medium">
                  {alienData.firstAppearance} ({alienData.series})
                  </span>
              </div>
            </div>

            <h3 className="md:text-xl font-bold mt-6 pt-4 border-t border-gray-200 text-green-700">Abilities</h3>
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
  );
}