import React from 'react';
import { LayoutGrid, Coffee, Croissant, Sandwich, UtensilsCrossed, Cake, CupSoda } from 'lucide-react';

const CategoryFilter = ({ activeCategory = 'All', onCategoryChange }) => {
  const categories = [
    { name: 'All', icon: LayoutGrid },
    { name: 'Coffee', icon: Coffee },
    { name: 'Breakfast', icon: Croissant },
    { name: 'Sandwiches', icon: Sandwich },
    { name: 'Pasta', icon: UtensilsCrossed },
    { name: 'Desserts', icon: Cake },
    { name: 'Beverages', icon: CupSoda },
  ];

  return (
    <div className="bg-cafe-bg py-3 sm:py-4 md:py-6 px-4 border-b border-gray-200">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-start md:justify-center gap-4 overflow-x-auto no-scrollbar pb-2">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.name;
            return (
              <button
                key={idx}
                onClick={() => onCategoryChange && onCategoryChange(cat.name)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full border transition-colors whitespace-nowrap ${
                  isActive 
                    ? 'bg-cafe-darker text-white border-cafe-darker shadow-md' 
                    : 'bg-white text-cafe-dark border-gray-200 hover:border-cafe-dark'
                }`}
              >
                <Icon size={16} strokeWidth={isActive ? 2 : 1.5} className={isActive ? 'text-cafe-accent' : 'text-cafe-accent'} />
                <span className="text-sm font-medium tracking-wide">{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;
