import React from 'react';
import menuHeroImg from '../../assets/images/about_hero_bg.png'; // Reusing about hero image

const MenuHero = () => {
  return (
    <section className="relative flex flex-col md:flex-row bg-cafe-bg overflow-hidden min-h-0 md:min-h-[50vh]">
      {/* Left Content */}
      <div className="flex-1 flex flex-col justify-center items-center md:items-start text-center md:text-left px-4 md:px-16 py-12 md:py-0 z-10 max-w-2xl">
        <p className="text-cafe-accent font-semibold tracking-widest text-sm mb-4 uppercase">
          OUR MENU
        </p>
        <h1 className="font-serif text-4xl md:text-6xl text-cafe-dark leading-tight mb-4">
          Handcrafted with love,<br/>
          <span className="italic text-cafe-accent font-light">served with passion.</span>
        </h1>
        
        <div className="text-cafe-accent my-4 flex justify-center md:justify-start w-full">
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
        </div>

        <p className="text-text-primary mb-10 text-sm leading-relaxed max-w-md font-medium mx-auto md:mx-0">
          From our signature brews to delicious bites, <br/>
          explore everything we have to offer.
        </p>
      </div>

      {/* Right Image area (Desktop Only) */}
      <div className="flex-1 relative min-h-[300px] md:min-h-[400px] hidden md:block">
        {/* Curved Shape Overlay */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <svg className="absolute left-0 h-full w-48 text-cafe-bg transform -scale-x-100 origin-left" preserveAspectRatio="none" viewBox="0 0 100 100" fill="currentColor">
            <path d="M 0 0 Q 100 20 50 50 T 0 100 Z" />
          </svg>
        </div>
        <img 
          src={menuHeroImg} 
          alt="Coffee Menu" 
          className="absolute inset-0 w-full h-full object-cover md:rounded-l-[150px] shadow-2xl z-0"
        />
      </div>
    </section>
  );
};

export default MenuHero;
