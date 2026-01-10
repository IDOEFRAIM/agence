'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('search') || '');

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (query) {
      params.set('search', query);
    } else {
      params.delete('search');
    }
    router.push(`/?${params.toString()}`, { scroll: false });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="bg-white p-2 rounded-full shadow-2xl shadow-blue-900/5 max-w-2xl mx-auto flex items-center border border-slate-100 relative z-20 hover:shadow-blue-900/10 transition-shadow duration-300">
      <div className="pl-6 pr-4 text-slate-400">
        <Search size={22} />
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Quelle ville ou université cherchez-vous ?"
        className="flex-1 h-12 outline-none text-slate-900 placeholder:text-slate-400 font-medium bg-transparent"
      />
      <div className="h-8 w-px bg-slate-200 mx-2"></div>
      <button className="hidden md:flex items-center gap-2 px-6 py-3 hover:bg-slate-50 rounded-full text-slate-600 font-bold text-sm transition-colors">
        <SlidersHorizontal size={16} />
        Filtres
      </button>
      <button 
        onClick={handleSearch}
        className="bg-blue-600 hover:bg-blue-700 text-white h-12 w-12 md:w-auto md:px-8 rounded-full font-bold shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2">
        <span className="hidden md:inline">Explorer</span>
        <div className="md:hidden"><Search size={20} /></div>
      </button>
    </div>
  );
}
