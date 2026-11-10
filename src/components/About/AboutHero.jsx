import React from 'react';

const AboutHero = () => {
  return (
    <section className="relative bg-cafe-darker text-white py-10 md:py-14 px-4 md:px-8 overflow-hidden text-center flex flex-col items-center justify-center border-b border-white/10">
      <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
        <span className="inline-block px-3.5 py-1 border border-white/20 text-cafe-accent font-medium tracking-[0.25em] text-xs uppercase mb-3 backdrop-blur-sm">
          ABOUT US
        </span>
        <h1 className="font-serif text-[clamp(1.05rem,4.6vw,2.75rem)] text-white leading-tight mb-3 whitespace-nowrap">
          More Than Just a Café, <span className="italic text-cafe-accent font-normal">It's Our Story</span>
        </h1>

        <div className="text-cafe-accent my-3 flex items-center justify-center gap-3">
          <div className="h-[1px] w-12 bg-cafe-accent/40"></div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          <div className="h-[1px] w-12 bg-cafe-accent/40"></div>
        </div>

        <p className="text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed max-w-lg font-light">
          Brew & Bloom was born from a simple passion — creating a warm sanctuary where exquisite coffee, genuine smiles, and cozy vibes bring people together.
        </p>
      </div>
    </section>
  );
};

export default AboutHero;
