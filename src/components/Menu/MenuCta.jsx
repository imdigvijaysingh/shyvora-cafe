import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Armchair, Users, Star, Gift } from 'lucide-react';
import ctaBg from '../../assets/images/cta_table_1784782567034.png'; // Reusing from home page

const FeatureItem = ({ icon: Icon, text }) => (
  <div className="flex items-center gap-4 mb-4">
    <div className="text-gray-300">
      <Icon size={24} strokeWidth={1} />
    </div>
    <span className="text-gray-200 text-sm font-light tracking-wide">{text}</span>
  </div>
);

const MenuCta = () => {
  return (
    <section className="py-12 px-4 md:px-8 bg-cafe-bg pb-24">
      <div className="max-w-7xl mx-auto rounded-3xl overflow-hidden relative min-h-[300px] flex items-center">
        {/* Background */}
        <div className="absolute inset-0 z-0">
           <img loading="lazy" 
              src={ctaBg} 
              alt="Dining Table" 
              className="w-full h-full object-cover"
           />
           <div className="absolute inset-0 bg-[#132014]/90"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 w-full p-8 md:p-12 flex flex-col md:flex-row items-center md:items-start justify-between gap-10">
          
          <div className="flex-1 md:pr-12 text-center md:text-left">
            <p className="text-gray-400 font-semibold tracking-widest text-[10px] mb-2 uppercase">DINE IN STYLE</p>
            <h2 className="font-serif text-3xl md:text-4xl text-white mb-4">Book a Table for a Perfect Experience</h2>
            <p className="text-gray-300 text-xs font-light leading-relaxed mb-8 max-w-sm mx-auto md:mx-0">
              Great food, warm ambience and memories that last forever.
            </p>
            <Link to="/book#reservation-form" className="bg-white text-cafe-dark px-6 py-2.5 text-xs font-medium tracking-wide flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors shadow-lg mx-auto md:mx-0 w-fit">
              BOOK A TABLE
              <Calendar size={14} />
            </Link>
          </div>

          <div className="hidden md:flex flex-col justify-center border-l border-white/10 pl-12">
            <div className="grid grid-cols-2 gap-x-16 gap-y-4">
               <FeatureItem icon={Armchair} text="Cozy Ambience" />
               <FeatureItem icon={Star} text="Friendly Staff" />
               <FeatureItem icon={Users} text="Great for Groups" />
               <FeatureItem icon={Gift} text="Special Occasions" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default MenuCta;
