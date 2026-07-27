import React, { useState } from 'react';
import OrderHero from '../components/OrderOnline/OrderHero';
import CategoryFilter from '../components/Menu/CategoryFilter';
import OrderGrid from '../components/OrderOnline/OrderGrid';
import OrderCart from '../components/OrderOnline/OrderCart';
import OrderFeatures from '../components/OrderOnline/OrderFeatures';

const OrderOnline = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  return (
    <>
      <OrderHero />
      <CategoryFilter activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
      
      <section className="py-12 px-4 md:px-8 bg-cafe-bg pb-24">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10 lg:items-start">
           <OrderGrid activeCategory={activeCategory} />
           <OrderCart />
        </div>
      </section>

      <OrderFeatures />
    </>
  );
};

export default OrderOnline;
