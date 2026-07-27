import React from 'react';
import { Calendar, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import tableImg from '../assets/images/cta_table_1784782567034.png';
import croissantImg from '../assets/images/cta_croissant_1784782576636.png';

const SplitCta = () => {
  const navigate = useNavigate();

  return (
    <section className="py-12 px-4 md:px-8 max-w-7xl mx-auto flex flex-col md:flex-row gap-8 bg-cafe-bg">
      
      {/* Left Block - Book a Table */}
      <div className="flex-1 rounded-2xl overflow-hidden relative group h-[450px]">
        <img loading="lazy" 
          src={tableImg} 
          alt="Romantic Table Setting" 
          className="absolute inset-0 w-full h-full object-cover brightness-50 group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cafe-darker/90 via-cafe-darker/50 to-transparent"></div>
        
        <div className="relative h-full flex flex-col justify-end p-8 md:p-12 text-white">
          <p className="text-cafe-accent font-semibold tracking-widest text-xs mb-2 uppercase">BOOK A TABLE</p>
          <h2 className="font-serif text-3xl md:text-4xl mb-6">Reserve your perfect spot</h2>
          
          <ul className="space-y-3 mb-8">
            <li className="flex items-center gap-3 text-sm font-light text-gray-200">
              <CheckCircle2 size={16} className="text-cafe-accent" /> Instant Confirmation
            </li>
            <li className="flex items-center gap-3 text-sm font-light text-gray-200">
              <CheckCircle2 size={16} className="text-cafe-accent" /> Special Occasions
            </li>
            <li className="flex items-center gap-3 text-sm font-light text-gray-200">
              <CheckCircle2 size={16} className="text-cafe-accent" /> Groups Welcome
            </li>
          </ul>
          
          <button 
            onClick={() => navigate('/book')}
            className="bg-white text-cafe-dark px-6 py-3 text-sm font-medium tracking-wide flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors w-fit shadow-lg"
          >
            BOOK NOW
            <Calendar size={16} />
          </button>
        </div>
      </div>

      {/* Right Block - Pre-order */}
      <div className="flex-1 rounded-2xl overflow-hidden relative bg-[#EFE9DF] h-[450px]">
        {/* Background Image decoration */}
        <div className="absolute -bottom-10 -right-10 w-3/4 h-3/4 opacity-90 z-0">
           <img loading="lazy" 
            src={croissantImg} 
            alt="Coffee and Croissant" 
            className="w-full h-full object-cover rounded-full"
            style={{ maskImage: 'radial-gradient(circle at center, black 50%, transparent 100%)', WebkitMaskImage: 'radial-gradient(circle at center, black 50%, transparent 100%)' }}
          />
        </div>

        <div className="relative h-full flex flex-col justify-start p-8 md:p-12 z-10">
          <p className="text-cafe-accent font-semibold tracking-widest text-xs mb-2 uppercase">PRE-ORDER YOUR FAVES</p>
          <h2 className="font-serif text-3xl md:text-4xl text-cafe-dark mb-6">Order ahead, skip the wait</h2>
          
          <ul className="space-y-3 mb-8 max-w-[60%]">
            <li className="flex items-center gap-3 text-sm text-text-primary font-medium">
              <CheckCircle2 size={16} className="text-cafe-accent" /> Easy Pre-ordering
            </li>
            <li className="flex items-center gap-3 text-sm text-text-primary font-medium">
              <CheckCircle2 size={16} className="text-cafe-accent" /> Quick Pickup
            </li>
            <li className="flex items-center gap-3 text-sm text-text-primary font-medium">
              <CheckCircle2 size={16} className="text-cafe-accent" /> Freshly Prepared
            </li>
          </ul>
          
          <button 
            onClick={() => navigate('/order')}
            className="mt-auto bg-cafe-accent text-white px-6 py-3 text-sm font-medium tracking-wide flex items-center justify-center gap-2 hover:bg-[#A9845B] transition-colors w-fit shadow-lg"
          >
            ORDER NOW
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          </button>
        </div>
      </div>

    </section>
  );
};

export default SplitCta;
