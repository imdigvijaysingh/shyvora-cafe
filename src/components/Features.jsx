import React from 'react';
import { Coffee, CupSoda, Armchair, Clock } from 'lucide-react';

const FeatureItem = ({ icon: Icon, title, description }) => (
  <div className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-4 text-center md:text-left p-2 md:p-4 w-full">
    <div className="text-cafe-accent bg-white p-3 rounded-full shadow-sm mb-1 md:mb-0 shrink-0">
      <Icon size={24} strokeWidth={1.5} className="md:w-7 md:h-7" />
    </div>
    <div>
      <h3 className="font-semibold text-cafe-dark mb-1 text-sm md:text-base">{title}</h3>
      <p className="text-xs md:text-sm text-text-secondary leading-relaxed max-w-[160px] md:max-w-[200px] mx-auto md:mx-0">
        {description}
      </p>
    </div>
  </div>
);

const Features = () => {
  return (
    <section className="bg-cafe-bg-alt py-10 md:py-12 px-4 md:px-8 shadow-[0_4px_30px_rgba(0,0,0,0.03)] relative z-10">
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-8 justify-items-center">
        <FeatureItem 
          icon={CupSoda} 
          title="Premium Quality" 
          description="Finest ingredients, exceptional taste" 
        />
        <FeatureItem 
          icon={Coffee} 
          title="Freshly Brewed" 
          description="Brewing perfection in every cup" 
        />
        <FeatureItem 
          icon={Armchair} 
          title="Cozy Ambience" 
          description="A warm and welcoming space for all" 
        />
        <FeatureItem 
          icon={Clock} 
          title="Fast & Reliable" 
          description="Quick service, every time" 
        />
      </div>
    </section>
  );
};

export default Features;
