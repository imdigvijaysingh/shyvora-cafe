import React from 'react';
import { Leaf, Clock, Heart } from 'lucide-react';
import orderHeroImg from '../../assets/images/about_story.png'; // Reusing about_story (coffee cup) as it works well for order hero

const FeatureBadge = ({ icon: Icon, text }) => (
  <div className="flex items-center gap-2 text-cafe-dark">
    <Icon size={18} strokeWidth={1.5} className="text-[#A26D51]" />
    <span className="text-xs font-semibold">{text}</span>
  </div>
);

const OrderHero = () => {
  return (
    <section className="relative flex flex-col md:flex-row bg-[#F8F5F0] overflow-hidden min-h-0 md:min-h-[50vh]">
      {/* Left Content */}
      <div className="flex-1 flex flex-col justify-center items-center md:items-start text-center md:text-left px-4 md:px-16 py-12 md:py-0 z-10 max-w-2xl">
        <p className="text-cafe-accent font-semibold tracking-widest text-[10px] mb-4 uppercase">
          GOOD FOOD, GREAT MOOD
        </p>
        <h1 className="font-serif text-5xl md:text-7xl text-cafe-dark leading-tight mb-2">
          Order Online
        </h1>
        <h2 className="font-serif text-4xl md:text-6xl text-cafe-accent italic font-light mb-6">
          We'll have it ready.
        </h2>

        <p className="text-text-primary mb-10 text-sm leading-relaxed max-w-sm font-medium mx-auto md:mx-0">
          Browse our menu, personalize your order, and we'll prepare it fresh for you.
        </p>
        
        <div className="flex flex-row flex-wrap justify-center sm:justify-start gap-x-6 gap-y-4 sm:gap-4 mt-6 w-full">
           <FeatureBadge icon={Leaf} text="Fresh Ingredients" />
           <FeatureBadge icon={Clock} text="Quick & Easy" />
           <FeatureBadge icon={Heart} text="Perfect Every Time" />
        </div>
      </div>

      {/* Right Image area (Desktop Only) */}
      <div className="flex-1 relative min-h-[300px] md:min-h-full hidden md:block">
        {/* Curved Shape Overlay */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <svg className="absolute left-0 h-full w-48 text-[#F8F5F0] transform -scale-x-100 origin-left" preserveAspectRatio="none" viewBox="0 0 100 100" fill="currentColor">
            <path d="M 0 0 Q 100 20 50 50 T 0 100 Z" />
          </svg>
        </div>
        <img 
          src={orderHeroImg} 
          alt="Coffee Cup and Takeout Bag" 
          className="absolute inset-0 w-full h-full object-cover md:rounded-l-[150px] shadow-2xl z-0"
        />
        {/* Decorative leaf element on bottom left */}
        <div className="absolute bottom-4 -left-16 transform opacity-20 pointer-events-none z-20">
          <svg width="180" height="180" viewBox="0 0 24 24" fill="none" stroke="#C29B70" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22c4-4 4-10 0-14 4 4 10 4 14 0-4 4-4 10 0 14-4-4-10-4-14 0Z"/>
            <path d="M12 2c-4 4-4 10 0 14-4-4-10-4-14 0 4-4 4-10 0-14 4 4 10 4 14 0Z"/>
          </svg>
        </div>
      </div>
    </section>
  );
};

export default OrderHero;
