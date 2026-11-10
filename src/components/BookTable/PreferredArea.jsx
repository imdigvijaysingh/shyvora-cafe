import React from 'react';
import { Users } from 'lucide-react';

// Reusing wide landscape images for areas
import indoorImg from '../../assets/images/about_hero_bg.webp';
import outdoorImg from '../../assets/images/about_story.webp';
import cornerImg from '../../assets/images/cta_table_1784782567034.webp';
import privateImg from '../../assets/images/about_testimonials.webp';

const AreaCard = ({ image, title, description, capacity }) => (
  <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-[#EBE3D5] flex flex-col group cursor-pointer hover:border-cafe-accent transition-colors">
    <div className="h-40 overflow-hidden relative">
      <img loading="lazy" 
        src={image} 
        alt={title} 
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
    </div>
    <div className="p-5 flex flex-col flex-1">
      <h4 className="font-semibold text-cafe-dark text-sm mb-2">{title}</h4>
      <p className="text-xs text-text-secondary leading-relaxed mb-4 flex-1">
        {description}
      </p>
      <div className="flex items-center gap-2 text-xs font-semibold text-cafe-dark mt-auto pt-4 border-t border-gray-100">
        <Users size={14} className="text-cafe-accent" />
        {capacity} People
      </div>
    </div>
  </div>
);

const PreferredArea = () => {
  const areas = [
    {
      title: "Indoor Seating",
      description: "Cozy indoor seating with a warm ambience.",
      capacity: "2 - 6",
      image: indoorImg
    },
    {
      title: "Outdoor Seating",
      description: "Enjoy in the fresh air surrounded by greenery.",
      capacity: "2 - 6",
      image: outdoorImg
    },
    {
      title: "Corner Table",
      description: "A perfect spot for a cozy and private experience.",
      capacity: "2 - 4",
      image: cornerImg
    },
    {
      title: "Private Area",
      description: "Ideal for small gatherings and special occasions.",
      capacity: "6 - 12",
      image: privateImg
    }
  ];

  return (
    <section className="bg-[#FDFBF7] py-8 sm:py-10 md:py-14 px-4 md:px-8 border-t border-[#EBE3D5] border-b">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <div className="text-center mb-6 md:mb-10">
           <h2 className="font-serif text-[clamp(1.15rem,5.2vw,2.25rem)] text-cafe-dark mb-4 whitespace-nowrap">Choose Your Preferred Area</h2>
           <div className="flex items-center justify-center gap-4 text-cafe-accent mb-6">
             <div className="h-[1px] w-12 bg-cafe-accent/30"></div>
             <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
             <div className="h-[1px] w-12 bg-cafe-accent/30"></div>
           </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {areas.map((area, idx) => (
            <AreaCard key={idx} {...area} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default PreferredArea;
