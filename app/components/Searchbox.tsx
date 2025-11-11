'use client';
import React, { useState } from 'react';
import { useAliens } from '@/lib/Store';

// ... existing code ...

const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="44"
    height="44"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

export default function Searchbox() {
  const { setSearch } = useAliens();
  const [inputValue, setInputValue] = useState('');

  const handleSearch = () => {
    setSearch(inputValue);
  }

  return (
    <div className="flex flex-row justify-center gap-4" >
      <div className='relative mt-4 md:w-100'>
      <input
        type="text"
        className="block w-full rounded-xl border border-green-200 shadow-lg px-6 py-4 text-lg md:pl-6 focus:ring-green-500 focus:border-green-500 transition duration-150"
        placeholder="Search by name or species..."
        value={inputValue}
        onChange={(e) => setInputValue(e.currentTarget.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSearch();
          }
        }}
      />
      </div>
      <SearchIcon
       className="border-2 mt-6 p-2 rounded-md bg-green-400 text-black cursor-pointer active:bg-green-700"
       onClick={handleSearch}
       />
    </div>
  );
}