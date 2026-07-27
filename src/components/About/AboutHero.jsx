import React from 'react';
import { ArrowRight } from 'lucide-react';
import aboutHeroImg from '../../assets/images/about_hero_bg.png';

const AboutHero = () => {
  return (
    <section className="relative flex flex-col md:flex-row bg-cafe-bg overflow-hidden min-h-0 md:min-h-[70vh]">
      {/* Left Content */}
      <div className="flex-1 flex flex-col justify-center items-center md:items-start text-center md:text-left px-4 md:px-16 py-12 md:py-0 z-10 max-w-2xl">
        <p className="text-cafe-accent font-semibold tracking-widest text-sm mb-4 uppercase">
          ABOUT US
        </p>
        <h1 className="font-serif text-5xl md:text-7xl text-cafe-dark leading-tight mb-4">
          More than just<br/>
          a café<br/>
          <span className="italic text-cafe-accent font-light">It's our story.</span>
        </h1>
        
        <div className="text-cafe-accent my-6 flex justify-center md:justify-start w-full">
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
        </div>

        <p className="text-text-primary mb-10 text-sm leading-relaxed max-w-md font-medium mx-auto md:mx-0">
          Brew & Bloom was born from a simple idea — <br/>
          to create a place where great coffee, good food, <br/>
          and warm conversations bring people together. <br/><br/>
          A space to slow down, feel at home, <br/>
          and savor life's little moments.
        </p>
      </div>

      {/* Right Image area with curved cut (reverse of hero) */}
      <div className="flex-1 relative min-h-[400px] md:min-h-full hidden md:block">
        {/* Curved Shape Overlay */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <svg className="absolute left-0 h-full w-48 text-cafe-bg transform -scale-x-100 origin-left" preserveAspectRatio="none" viewBox="0 0 100 100" fill="currentColor">
            <path d="M 0 0 Q 100 20 50 50 T 0 100 Z" />
          </svg>
        </div>
        <img 
          src={aboutHeroImg} 
          alt="Cafe Interior Wide" 
          className="absolute inset-0 w-full h-full object-cover md:rounded-l-[150px] shadow-2xl z-0"
        />
        {/* Subtle decorative leaf element on bottom left */}
        <div className="absolute bottom-10 -left-16 transform opacity-20 pointer-events-none z-20">
          <svg width="180" height="180" viewBox="0 0 24 24" fill="none" stroke="#C29B70" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22c4-4 4-10 0-14 4 4 10 4 14 0-4 4-4 10 0 14-4-4-10-4-14 0Z"/>
            <path d="M12 2c-4 4-4 10 0 14-4-4-10-4-14 0 4-4 4-10 0-14 4 4 10 4 14 0Z"/>
          </svg>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;
