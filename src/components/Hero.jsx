import { Link } from "react-router-dom";
import heroVideoWebm from "../assets/videos/home_hero.webm";

const Hero = () => {
  return (
    <section className="relative w-full min-h-[85dvh] md:min-h-[85dvh] lg:min-h-[85dvh] pb-4 flex items-center justify-center overflow-hidden bg-cafe-darker">
      {/* Video Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={heroVideoWebm} type="video/webm" />
        </video>
      </div>

      {/* Dark Overlay for Text Readability */}
      <div className="absolute inset-0 z-10 bg-black/50 md:bg-black/40"></div>

      {/* Main Content - Centered & Sleek */}
      <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center mt-2 md:mt-0">
        <div className="inline-block px-4 py-1.5 md:px-5 md:py-2 border border-white/30 text-white font-medium tracking-[0.2em] md:tracking-[0.25em] text-[10px] sm:text-xs md:text-sm mb-6 uppercase animate-fade-in-up backdrop-blur-sm">
          Good Coffee, Good Mood
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-white leading-[1.1] md:leading-[1.1] mb-4 md:mb-6 animate-fade-in-up-delay-1 drop-shadow-xl px-2">
          Savor Moments,
          <br />
          <span className="italic text-cafe-accent">Sip Happiness</span>
        </h1>

        <p className="text-gray-200 mb-8 md:mb-10 text-base sm:text-lg md:text-xl leading-relaxed font-light max-w-2xl mx-auto animate-fade-in-up-delay-2 drop-shadow-md px-2">
          Experience the perfect blend of rich flavors, cozy vibes, and
          unforgettable moments in every cup. Your daily escape awaits.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 animate-fade-in-up-delay-2 w-full max-w-xs sm:max-w-none mx-auto">
          <Link to="/order" className="bg-cafe-accent text-white px-8 md:px-10 py-3.5 md:py-4 text-xs sm:text-sm font-semibold tracking-[0.1em] hover:bg-[#A88358] transition-all duration-300 w-full sm:w-auto text-center inline-block">
            ORDER NOW
          </Link>
          <Link to="/book" className="bg-black/20 backdrop-blur-sm border border-white text-white px-8 md:px-10 py-3.5 md:py-4 text-xs sm:text-sm font-semibold tracking-[0.1em] hover:bg-white hover:text-cafe-dark transition-all duration-300 w-full sm:w-auto text-center inline-block">
            BOOK A TABLE
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
