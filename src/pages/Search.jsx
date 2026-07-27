import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchMenu } from '../data/menuData';
import OrderItemCard from '../components/OrderOnline/OrderItemCard';
import { LayoutGrid, List, SlidersHorizontal, ChevronDown, X } from 'lucide-react';

const SearchFilters = ({ filters, setFilters, onClose, isOpen }) => {
  return (
    <div className={`fixed inset-0 z-50 md:z-0 md:static md:block md:w-64 flex-shrink-0 transition-transform transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 bg-black/50 md:bg-transparent`}>
      <div className="bg-[#F8F5F0] h-full md:h-auto w-4/5 md:w-full md:rounded-2xl border-r md:border border-[#EBE3D5] p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6 md:hidden">
          <h3 className="font-semibold text-cafe-dark">Filters</h3>
          <button onClick={onClose}><X size={20} /></button>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h4 className="font-semibold text-cafe-dark text-xs uppercase tracking-widest mb-4">CATEGORIES</h4>
          <div className="space-y-3">
            {['Coffee', 'Beverages', 'Combos'].map((cat) => (
              <label key={cat} className="flex justify-between items-center cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-colors ${filters.categories.includes(cat) ? 'bg-cafe-dark border-cafe-dark' : 'border-[#EBE3D5] group-hover:border-cafe-dark'}`}>
                    {filters.categories.includes(cat) && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                  </div>
                  <span className="text-sm text-text-secondary">{cat}</span>
                </div>
                <span className="text-[10px] text-gray-400 font-medium">(5)</span>
              </label>
            ))}
          </div>
        </div>

        {/* Type */}
        <div className="mb-8 border-t border-[#EBE3D5] pt-6">
          <h4 className="font-semibold text-cafe-dark text-xs uppercase tracking-widest mb-4">TYPE</h4>
          <div className="space-y-3">
            {['Hot', 'Iced'].map((type) => (
              <label key={type} className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-colors ${filters.type === type ? 'bg-cafe-dark border-cafe-dark' : 'border-[#EBE3D5] group-hover:border-cafe-dark'}`}>
                    {filters.type === type && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                </div>
                <span className="text-sm text-text-secondary">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price */}
        <div className="mb-8 border-t border-[#EBE3D5] pt-6">
          <h4 className="font-semibold text-cafe-dark text-xs uppercase tracking-widest mb-4">PRICE</h4>
          <div className="flex justify-between text-xs text-text-secondary mb-2">
            <span>₹0</span>
            <span>₹500</span>
          </div>
          {/* Mock Slider */}
          <div className="h-1 bg-[#EBE3D5] w-full rounded-full relative mb-4">
             <div className="absolute left-0 top-0 h-full w-full bg-[#A26D51] rounded-full"></div>
             <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-cafe-dark shadow-sm cursor-pointer"></div>
             <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-cafe-dark shadow-sm cursor-pointer"></div>
          </div>
        </div>

        <button className="text-[10px] font-semibold text-cafe-dark tracking-widest uppercase hover:text-cafe-accent transition-colors pt-4 border-t border-[#EBE3D5] w-full text-left">
          RESET FILTERS
        </button>

      </div>
    </div>
  );
};

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({ categories: ['Coffee'], type: '' }); // Defaulting Coffee for visual mockup
  
  const results = searchMenu(query);

  return (
    <section className="py-12 px-4 md:px-8 bg-cafe-bg min-h-screen">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 items-start">
         
         <SearchFilters 
            isOpen={isFiltersOpen} 
            onClose={() => setIsFiltersOpen(false)}
            filters={filters}
            setFilters={setFilters}
         />

         {/* Main Content */}
         <div className="flex-1 w-full">
            <h1 className="font-serif text-2xl md:text-3xl text-cafe-dark mb-8">
              Search results for "{query}"
            </h1>
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <span className="text-sm font-semibold text-text-secondary">{results.length} results found</span>
              
              <div className="flex items-center gap-4">
                <button onClick={() => setIsFiltersOpen(true)} className="md:hidden flex items-center gap-2 text-sm text-cafe-dark border border-[#EBE3D5] px-3 py-1.5 rounded-md">
                   <SlidersHorizontal size={14} /> Filters
                </button>
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <span>Sort by:</span>
                  <div className="flex items-center gap-1 border border-[#EBE3D5] px-3 py-1.5 rounded-md bg-white cursor-pointer hover:border-cafe-accent">
                    <span className="font-medium text-cafe-dark">Relevance</span>
                    <ChevronDown size={14} />
                  </div>
                </div>
                <div className="hidden sm:flex border border-[#EBE3D5] rounded-md overflow-hidden">
                  <button className="p-2 bg-cafe-dark text-white"><LayoutGrid size={16} /></button>
                  <button className="p-2 bg-white text-gray-400 hover:text-cafe-dark transition-colors"><List size={16} /></button>
                </div>
              </div>
            </div>

            {results.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {results.map((item, idx) => (
                  <OrderItemCard key={idx} {...item} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center">
                <p className="text-gray-500 mb-4">No results found for "{query}".</p>
                <button className="text-cafe-accent underline underline-offset-4 font-semibold text-sm">Clear search and browse menu</button>
              </div>
            )}
         </div>
      </div>
    </section>
  );
};

export default Search;
