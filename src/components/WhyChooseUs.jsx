import React from 'react';
import { Map, UserCheck, Heart, Users } from 'lucide-react';

const ReasonItem = ({ icon: Icon, title, description }) => (
  <div className="flex flex-col items-center text-center p-2 sm:p-6 gap-2 sm:gap-3">
    <div className="text-cafe-dark mb-1 sm:mb-2">
      <Icon size={28} strokeWidth={1.5} className="sm:w-8 sm:h-8" />
    </div>
    <h3 className="font-semibold text-cafe-dark text-sm sm:text-base">{title}</h3>
    <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-[140px] sm:max-w-[200px]">
      {description}
    </p>
  </div>
);

const WhyChooseUs = () => {
  return (
    <section className="py-12 md:py-20 px-4 md:px-8 bg-cafe-bg">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
        <p className="text-cafe-accent font-semibold tracking-widest text-xs md:text-sm mb-2 uppercase">WHY CHOOSE US</p>
        <h2 className="font-serif text-[clamp(1.25rem,5.5vw,2.25rem)] text-cafe-dark mb-6 md:mb-10 whitespace-nowrap">More than just a café</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-4 w-full">
          <ReasonItem 
            icon={Map} 
            title="Locally Sourced" 
            description="We support local farmers & sustainable practices" 
          />
          <ReasonItem 
            icon={UserCheck} 
            title="Expert Baristas" 
            description="Passionate hands crafting your favorite brews" 
          />
          <ReasonItem 
            icon={Heart} 
            title="Made with Love" 
            description="Every dish & drink is made with care" 
          />
          <ReasonItem 
            icon={Users} 
            title="Community First" 
            description="A space to connect, relax & belong" 
          />
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
