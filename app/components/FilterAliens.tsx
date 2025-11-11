'use client';
import React from 'react';
import { useAliens } from '@/lib/Store';

export default function FilterAliens() {
  const { series, setSeries } = useAliens();

  const seriesOptions = [
    { value: 'Classic', label: 'Ben 10: Classic' },
    { value: 'Alien Force', label: 'Ben 10: Alien Force' },
    { value: 'Ultimate Alien', label: 'Ben 10: Ultimate Alien' },
  ];

  return (
    <div className="flex flex-row justify-between p-2 md:w-300 mx-auto">
      <div className="w-2"></div>
      <div className='mt-4 md:w-82 flex flex-row'>
      <label htmlFor="series-filter" className=" text-md font-normal md:w-24 mt-2 mr-1 text-gray-500 ">
        {/*<FontAwesomeIcon icon={faThinFilter} className="" />*/}
        Filter By
      </label>
      <select id="series-filter" className=" md:w-full rounded-md border-2 border-green-200 text-gray-400 bg-black shadow-sm focus:border-green-500 focus:ring-green-500 px-2 py-2" value={series} onChange={(e) => setSeries(e.target.value)}>
        <option value="">All Series</option>
        {seriesOptions.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      </div>
    </div>
  );
}