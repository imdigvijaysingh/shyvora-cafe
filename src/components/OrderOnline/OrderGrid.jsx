import React from 'react';
import OrderItemCard from './OrderItemCard';

// Image imports
import item1 from '../../assets/images/menu_cappuccino_1784782504483.png';
import item2 from '../../assets/images/menu_toast_1784782514646.png';
import item3 from '../../assets/images/menu_cheesecake_1784782526474.png';
import item4 from '../../assets/images/menu_iced_latte_1784782557336.png';
import item5 from '../../assets/images/cta_croissant_1784782576636.png'; // Reusing for sandwich

// Duplicate images to fill the grid as per the mockup
const items = [
  {
    category: "Coffee",
    image: item1,
    title: "Cappuccino",
    description: "Rich espresso with steamed milk",
    price: "199"
  },
  {
    category: "Breakfast",
    image: item2,
    title: "Avocado Toast",
    description: "Fresh avocado, herbs & sourdough",
    price: "249"
  },
  {
    category: "Desserts",
    image: item3,
    title: "Classic Cheesecake",
    description: "Creamy, rich & perfectly sweet",
    price: "239"
  },
  {
    category: "Coffee",
    image: item4,
    title: "Iced Caramel Latte",
    description: "Smooth espresso with caramel over ice",
    price: "219"
  },
  {
    category: "Sandwiches",
    image: item5,
    title: "Pesto Chicken Sandwich",
    description: "Grilled chicken, basil pesto, cheese, toasted bread",
    price: "279"
  },
  {
    category: "Pasta",
    image: item1, // Reusing cappuccino for pasta visual placeholder
    title: "Aglio Olio Pasta",
    description: "Garlic, olive oil, chili flakes, parmesan",
    price: "259"
  },
  {
    category: "Desserts",
    image: item3, // Reusing cheesecake for brownie
    title: "Chocolate Brownie",
    description: "Warm brownie with ice cream",
    price: "199"
  },
  {
    category: "Beverages",
    image: item4, // Reusing iced latte for smoothie
    title: "Berry Smoothie",
    description: "Blended berries with yogurt",
    price: "199"
  }
];

const OrderGrid = ({ activeCategory = 'All' }) => {
  const filteredItems = activeCategory === 'All' 
    ? items 
    : items.filter(item => item.category === activeCategory);

  return (
    <div className="flex-1 mb-12 w-full">
      <h2 className="font-serif text-2xl text-cafe-dark mb-6">
        {activeCategory === 'All' ? 'Our Menu' : activeCategory}
      </h2>
      
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item, idx) => (
            <OrderItemCard key={idx} {...item} />
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
