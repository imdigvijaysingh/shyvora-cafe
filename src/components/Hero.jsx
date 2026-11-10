import { Link } from "react-router-dom";
import heroVideoWebm from "../assets/videos/home_hero.webm";
import { useCafeData } from "../context/CafeDataContext";

const Hero = () => {
  const { settings } = useCafeData();
  const hero = settings?.hero;

  const videoSource = hero?.videoUrl || heroVideoWebm;
  const poster = hero?.posterUrl || "/hero_poster.webp";
  const tagline = hero?.tagline || "Good Coffee, Good Mood";
  const titleLine1 = hero?.titleLine1 || "Savor Moments,";
  const titleLine2 = hero?.titleLine2 || "Sip Happiness";

  return (
    <section className="relative w-full h-[50dvh] min-h-[350px] max-h-[52dvh] md:h-auto md:min-h-[55vh] md:max-h-none flex items-center justify-center overflow-hidden bg-cafe-darker py-6 md:py-16">
      {/* Video Background with instant lightweight poster for green LCP */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          key={videoSource}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster={poster}
          className="absolute inset-0 w-full h-full object-cover object-center"
        >
          <source src={videoSource} type="video/webm" />
          <source src={videoSource} type="video/mp4" />
        </video>
      </div>

      {/* Dark Overlay for Text Readability */}
      <div className="absolute inset-0 z-10 bg-black/55 md:bg-black/45"></div>

      {/* Main Content - Spacious, Elegant & Uncluttered */}
      <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        {/* Tag Pill */}
        <div className="inline-block px-3.5 py-1 sm:px-5 sm:py-1.5 border border-white/30 text-white font-medium tracking-[0.2em] md:tracking-[0.25em] text-[10px] sm:text-xs md:text-sm mb-3 sm:mb-4 uppercase animate-fade-in-up backdrop-blur-sm">
          {tagline}
        </div>

        {/* Hero Headline - Single row headline */}
        <h1 className="font-serif text-[clamp(1.25rem,5.6vw,3.75rem)] text-white leading-tight mb-3 sm:mb-5 animate-fade-in-up-delay-1 drop-shadow-xl px-2 whitespace-nowrap">
          {titleLine1} <span className="italic text-cafe-accent">{titleLine2}</span>
        </h1>

        {/* Description - Hidden on compact mobile to eliminate clutter; shown on tablet/desktop */}
        <p className="hidden sm:block text-gray-200 mb-6 md:mb-8 text-sm md:text-base leading-relaxed font-light max-w-lg mx-auto animate-fade-in-up-delay-2 drop-shadow-md px-2">
          Experience the perfect blend of rich flavors, cozy vibes, and
          unforgettable moments in every cup. Your daily escape awaits.
        </p>

        {/* CTA Buttons - Spacious & Touch-friendly */}
        <div className="flex flex-row justify-center items-center gap-3 sm:gap-4 animate-fade-in-up-delay-2 w-auto mx-auto mt-1 sm:mt-0">
          <Link 
            to="/order" 
            className="bg-cafe-accent text-white px-5 sm:px-8 md:px-9 py-2.5 sm:py-3.5 text-xs sm:text-sm font-semibold tracking-[0.1em] hover:bg-[#A88358] transition-all duration-300 text-center inline-block shadow-md whitespace-nowrap"
          >
            ORDER NOW
          </Link>
          <Link 
            to="/book" 
            className="bg-black/25 backdrop-blur-sm border border-white text-white px-5 sm:px-8 md:px-9 py-2.5 sm:py-3.5 text-xs sm:text-sm font-semibold tracking-[0.1em] hover:bg-white hover:text-cafe-dark transition-all duration-300 text-center inline-block shadow-md whitespace-nowrap"
          >
            BOOK A TABLE
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
