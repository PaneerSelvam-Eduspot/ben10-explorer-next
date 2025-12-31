'use client';
import Searchbox from '../components/Searchbox';
import FilterAliens from '../components/FilterAliens';
import AlienList from '../components/AlienList';
import ExplorerBackground from '../components/ExplorerBackground';
import OmnitrixBackground from '../components/OmnitrixBackground';

export default function ExplorerPage() {
  return (
    <div>
      
      <ExplorerBackground />
     
    <div className="p-4 ">
      {/*<h1 className="text-4xl font-extrabold text-center text-[#00FF00]/70 mb-2">Alien Explorer</h1>
      <p className="text-center text-gray-600 mb-6">Discovering alien species across dimensions.</p>*/}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-grow">
          <Searchbox />
        </div>
      </div>
       <div className="md:w-full">
          <FilterAliens />
        </div>
      <AlienList />
    </div>
    </div>
  );
}