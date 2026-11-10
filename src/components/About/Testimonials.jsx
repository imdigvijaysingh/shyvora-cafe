import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import testimonialsBg from '../../assets/images/about_testimonials.webp';

const TestimonialCard = ({ quote, author }) => (
  <div className="flex flex-col items-center text-center px-4 md:px-8 w-full animate-fade-in">
    <div className="flex gap-1 mb-4 text-cafe-accent">
       <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
       <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
       <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
       <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
       <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
    </div>
    <p className="text-white text-lg md:text-xl font-light leading-relaxed mb-6 max-w-2xl italic">
      "{quote}"
    </p>
    <p className="text-cafe-accent text-sm font-semibold tracking-widest uppercase">
      — {author}
    </p>
  </div>
);

const Testimonials = () => {
  const reviews = [
    { quote: "The best coffee and the coziest ambience in town! I can't imagine starting my day anywhere else.", author: "Ananya S." },
    { quote: "Every visit feels special. The staff is so warm and welcoming. It's truly my home away from home.", author: "Rohan P." },
    { quote: "Their food is amazing and the coffee is just perfect. A highly recommended spot for everyone.", author: "Neha T." }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [reviews.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  return (
    <section className="relative py-10 sm:py-14 md:py-16 px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
         <img loading="lazy" 
            src={testimonialsBg} 
            alt="Cafe background" 
            className="w-full h-full object-cover"
         />
         <div className="absolute inset-0 bg-[#132014]/85"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
        <h2 className="font-serif text-[clamp(1.2rem,5.5vw,2.25rem)] text-white mb-6 text-center whitespace-nowrap">Loved by Our Community</h2>
        
        <div className="text-cafe-accent mb-12 flex justify-center items-center">
           <div className="h-[1px] w-12 bg-cafe-accent/30 mr-4"></div>
           <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
           <div className="h-[1px] w-12 bg-cafe-accent/30 ml-4"></div>
        </div>

        <div className="flex items-center justify-between w-full relative">
           <button 
             onClick={handlePrev}
             className="text-white hover:text-cafe-accent transition-colors border border-white/20 hover:border-cafe-accent rounded-full p-3 absolute left-0 z-20 md:static bg-black/20"
           >
             <ArrowLeft size={20} strokeWidth={1.5} />
           </button>
           
           <div className="w-full overflow-hidden flex justify-center px-12 md:px-0">
             <TestimonialCard key={currentIndex} {...reviews[currentIndex]} />
           </div>

           <button 
             onClick={handleNext}
             className="text-white hover:text-cafe-accent transition-colors border border-white/20 hover:border-cafe-accent rounded-full p-3 absolute right-0 z-20 md:static bg-black/20"
           >
             <ArrowRight size={20} strokeWidth={1.5} />
           </button>
        </div>
        
        <div className="flex gap-2 mt-8">
          {reviews.map((_, idx) => (
            <button 
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-cafe-accent w-6' : 'bg-white/30 hover:bg-white/50'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
