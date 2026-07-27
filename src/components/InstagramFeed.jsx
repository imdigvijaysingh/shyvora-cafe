import React from 'react';
import { ArrowRight } from 'lucide-react';

// Reusing some generated images for the instagram feed to avoid generating more just for this
import img1 from '../assets/images/menu_cappuccino_1784782504483.png';
import img2 from '../assets/images/cta_table_1784782567034.png';
import img3 from '../assets/images/hero_cafe_1784782478337.png';
import img4 from '../assets/images/cta_croissant_1784782576636.png';
import img5 from '../assets/images/menu_cheesecake_1784782526474.png';

const InstagramFeed = () => {
  const images = [img1, img2, img3, img4, img5];

  return (
    <section className="py-16 bg-cafe-bg overflow-hidden flex flex-col items-center">
      <p className="text-cafe-dark font-semibold tracking-widest text-sm mb-8 uppercase text-center">
        FOLLOW US @BREWANDBLOOM.CAFE
      </p>
      
      {/* Scrollable grid for mobile, static for desktop */}
      <div className="flex gap-4 w-full overflow-x-auto pb-4 px-4 md:px-0 md:justify-center no-scrollbar">
        {images.map((img, idx) => (
          <div key={idx} className="min-w-[200px] w-48 h-48 md:w-56 md:h-56 flex-shrink-0 rounded-xl overflow-hidden group cursor-pointer relative">
            <img loading="lazy" 
              src={img} 
              alt={`Instagram post ${idx + 1}`} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            {/* Instagram hover overlay */}
            <div className="absolute inset-0 bg-cafe-darker/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </div>
          </div>
        ))}
      </div>

      <button className="mt-8 flex items-center gap-2 border border-gray-300 text-cafe-dark px-6 py-2.5 text-xs font-semibold tracking-widest uppercase hover:bg-gray-100 transition-colors">
        VIEW MORE ON INSTAGRAM <ArrowRight size={14} />
      </button>
    </section>
  );
};

export default InstagramFeed;
