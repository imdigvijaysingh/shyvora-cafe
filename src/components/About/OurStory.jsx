import React from 'react';
import aboutStoryImg from '../../assets/images/about_story.webp';
import { Coffee, Leaf, Users } from 'lucide-react';

const FeatureCol = ({ icon: Icon, title, description }) => (
  <div className="flex flex-col items-center text-center gap-3">
    <div className="text-cafe-accent mb-2">
      <Icon size={32} strokeWidth={1} />
    </div>
    <h3 className="font-semibold text-cafe-dark">{title}</h3>
    <p className="text-xs text-text-secondary leading-relaxed max-w-[180px]">
      {description}
    </p>
  </div>
);

const OurStory = () => {
  return (
    <section className="py-8 sm:py-12 md:py-16 px-4 md:px-8 bg-cafe-bg flex flex-col md:flex-row gap-8 md:gap-16 max-w-7xl mx-auto items-center">
      {/* Left Image Box */}
      <div className="hidden md:block flex-1 w-full relative">
        <div className="rounded-3xl overflow-hidden shadow-xl aspect-[4/3] relative group">
           <img loading="lazy" 
              src={aboutStoryImg} 
              alt="Coffee cup and flowers" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            {/* Text Overlay */}
            <div className="absolute inset-0 bg-black/30 p-8 flex flex-col justify-center">
               <h3 className="font-serif text-4xl text-[#EFE9DF] italic opacity-90 leading-snug">
                 Good coffee.<br/>Good people.<br/>Good vibes.
               </h3>
            </div>
        </div>
      </div>

      {/* Right Content */}
      <div className="flex-1 flex flex-col">
        <p className="text-cafe-accent font-semibold tracking-widest text-xs mb-3 uppercase">
          OUR STORY
        </p>
        <h2 className="font-serif text-[clamp(1.15rem,5vw,2.5rem)] text-cafe-dark leading-tight mb-4 whitespace-nowrap">
          Brewing Happiness Since Day One
        </h2>
        
        <div className="text-cafe-accent my-4 flex items-center mb-6">
           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
           <div className="h-[1px] w-full bg-cafe-accent/30 ml-4"></div>
        </div>

        <p className="text-sm text-text-primary leading-relaxed mb-12 max-w-md font-medium">
          What started as a tiny corner with a big dream has blossomed into a beloved café for our amazing community. We believe in quality, sustainability, and kindness — in every cup we brew and every connection we make.
        </p>

        {/* 3 Columns */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
           <FeatureCol 
             icon={Coffee}
             title="Quality First"
             description="We use the finest ingredients and ethically sourced beans."
           />
           <FeatureCol 
             icon={Leaf}
             title="Sustainable Choice"
             description="We care for our planet as much as our coffee."
           />
           <FeatureCol 
             icon={Users}
             title="Community Always"
             description="A café that's built on love and connection."
           />
        </div>
      </div>
    </section>
  );
};

export default OurStory;
