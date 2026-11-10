import React from 'react';
import OrderItemCard from './OrderItemCard';
import { useCafeData } from '../../context/CafeDataContext';

const OrderGrid = ({ activeCategory = 'All' }) => {
  const { menuItems } = useCafeData();

  const filteredItems = activeCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category && item.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <div className="flex-1 mb-12 w-full">
      <h2 className="font-serif text-[clamp(1.2rem,5vw,1.75rem)] text-cafe-dark mb-6 whitespace-nowrap">
        {activeCategory === 'All' ? 'Our Menu' : activeCategory}
      </h2>
      
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <OrderItemCard 
              key={item.id || item.name} 
              title={item.name}
              description={item.description}
              price={item.price}
              image={item.image}
              category={item.category}
            />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center text-text-secondary border border-[#EBE3D5] border-dashed rounded-xl">
          <p>No items found in this category.</p>
        </div>
      )}
    </div>
  );
};

export default OrderGrid;
