'use client';
import Searchbox from '../components/Searchbox';
import FilterAliens from '../components/FilterAliens';
import AlienList from '../components/AlienList';
import OmnitrixBackground from '../components/OmnitrixBackground';
import OmnitrixLoader from '../components/OmnitrixLoader';

export default function ExplorerPage() {
  return (
    <div>
      
      <OmnitrixBackground />
    <div className="p-8">
      <h1 className="text-4xl font-extrabold text-center text-green-700 mb-2">Alien Explorer</h1>
      {/*<p className="text-center text-gray-600 mb-6">Discovering alien species across dimensions.</p>*/}
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