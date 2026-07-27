import React from 'react';
import { Link } from 'react-router-dom';
import { Armchair, Heart, Clock, Star, GlassWater } from 'lucide-react';

const PerkItem = ({ icon: Icon, title, description }) => (
  <div className="flex gap-5 mb-8">
    <div className="w-12 h-12 rounded-full bg-[#F8F5F0] border border-[#EBE3D5] flex items-center justify-center text-[#A26D51] flex-shrink-0">
      <Icon size={20} strokeWidth={1.5} />
    </div>
    <div>
      <h4 className="font-semibold text-cafe-dark text-sm mb-1">{title}</h4>
      <p className="text-xs text-text-secondary leading-relaxed">{description}</p>
    </div>
  </div>
);

const WhyBookSidebar = () => {
  return (
    <div className="w-full lg:w-[350px] flex-shrink-0">
      <div className="mb-10">
        <h3 className="font-serif text-xl text-cafe-dark tracking-widest uppercase mb-6 text-center md:text-left">WHY BOOK WITH US?</h3>
        
        <div className="text-cafe-accent mb-10 flex items-center justify-center md:justify-start">
           <div className="h-[1px] w-8 bg-cafe-accent/30 mr-2"></div>
           <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
           <div className="h-[1px] w-8 bg-cafe-accent/30 ml-2"></div>
        </div>

        <PerkItem 
          icon={Armchair} 
          title="Priority Seating" 
          description="Get your preferred table without the wait." 
        />
        <PerkItem 
          icon={Heart} 
          title="Perfect for Any Occasion" 
          description="From casual meetups to special celebrations." 
        />
        <PerkItem 
          icon={Clock} 
          title="Cozy Ambience" 
          description="Beautifully curated spaces just for you." 
        />
        <PerkItem 
          icon={Star} 
          title="Great Experience" 
          description="Exceptional service and unforgettable moments." 
        />
      </div>

      <div className="bg-[#F8F5F0] p-6 rounded-xl border border-[#EBE3D5] text-center">
        <div className="flex justify-center text-[#A26D51] mb-4">
           <GlassWater size={32} strokeWidth={1.5} />
        </div>
        <h4 className="font-semibold text-cafe-dark text-sm mb-2">Planning a special event?</h4>
        <p className="text-xs text-text-secondary leading-relaxed mb-4">We'd love to make it unforgettable.</p>
        <Link to="/contact" className="text-[10px] font-semibold text-cafe-accent tracking-widest uppercase hover:text-cafe-dark transition-colors border-b border-cafe-accent pb-0.5">
          CONTACT US →
        </Link>
      </div>
    </div>
  );
};

export default WhyBookSidebar;
