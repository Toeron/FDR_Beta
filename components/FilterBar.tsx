
import React from 'react';
import { FilterState } from '../types';

interface FilterBarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}

const FilterBar: React.FC<FilterBarProps> = ({ filters, setFilters }) => {
  return (
    <div className="bg-[#0d0d0d] border-y border-zinc-800 sticky top-0 z-30 shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
      <div className="max-w-7xl mx-auto px-4 py-4 md:py-8 flex justify-center">
        
        <div className="w-full max-w-2xl relative group">
          <input
            type="text"
            placeholder="search"
            value={filters.searchQuery}
            onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
            className="w-full bg-black border-2 border-zinc-800 group-hover:border-zinc-700 focus:border-[#d4af37] text-white px-8 py-5 outline-none transition-all placeholder:text-zinc-400 placeholder:uppercase placeholder:text-[10px] placeholder:tracking-[0.4em] text-center font-bold text-lg focus:shadow-[0_0_20px_rgba(212,175,55,0.1)]"
          />
          <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="w-6 h-6 text-[#d4af37]/60 group-hover:text-[#d4af37] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FilterBar;
