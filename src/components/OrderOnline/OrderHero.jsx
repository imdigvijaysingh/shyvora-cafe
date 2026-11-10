import React from 'react';
import { Leaf, Clock, Heart } from 'lucide-react';

const OrderHero = () => {
  return (
    <section className="relative bg-cafe-darker text-white py-10 md:py-14 px-4 md:px-8 overflow-hidden text-center flex flex-col items-center justify-center border-b border-white/10">
      <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
        <span className="inline-block px-3.5 py-1 border border-white/20 text-cafe-accent font-medium tracking-[0.25em] text-xs uppercase mb-3 backdrop-blur-sm">
          GOOD FOOD, GREAT MOOD
        </span>
        <h1 className="font-serif text-[clamp(1.15rem,5.2vw,2.75rem)] text-white leading-tight mb-2 whitespace-nowrap">
          Order Online, <span className="italic text-cafe-accent font-normal">We'll Have It Ready</span>
        </h1>
        <p className="text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed max-w-md font-light mb-5">
          Browse our freshly prepared menu items and customize your order for pickup or table service.
        </p>
        
        <div className="flex flex-row flex-wrap justify-center items-center gap-3 sm:gap-6 text-gray-300 text-xs">
          <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
            <Leaf size={14} className="text-cafe-accent" />
            <span>Fresh Ingredients</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
            <Clock size={14} className="text-cafe-accent" />
            <span>Quick & Easy</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
            <Heart size={14} className="text-cafe-accent" />
            <span>Handmade with Love</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderHero;
