import React from 'react';
import { MapPin, Phone } from 'lucide-react';

const InstagramIcon = ({ size, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);

const FacebookIcon = ({ size, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);

const TopBar = () => {
  return (
    <div className="bg-cafe-dark text-cafe-bg py-1.5 md:py-2 px-0 md:px-8 text-[11px] md:text-xs z-50 relative overflow-hidden">
      {/* Mobile Marquee View */}
      <div className="md:hidden flex overflow-hidden w-full relative h-6 items-center">
        <div className="flex animate-marquee w-max whitespace-nowrap">
          <div className="flex items-center">
            <span className="mx-4 flex items-center gap-1"><MapPin size={12} /> 12 Brew Boulevard, New Delhi</span>
            <span className="mx-2 font-medium text-cafe-accent"> • </span>
            <span className="mx-4 font-medium tracking-wide">Free delivery on orders above ₹499</span>
            <span className="mx-2 font-medium text-cafe-accent"> • </span>
            <span className="mx-4 flex items-center gap-1"><Phone size={12} /> +91 98765 43210</span>
          </div>
          {/* Duplicated for seamless loop */}
          <div className="flex items-center">
            <span className="mx-4 flex items-center gap-1"><MapPin size={12} /> 12 Brew Boulevard, New Delhi</span>
            <span className="mx-2 font-medium text-cafe-accent"> • </span>
            <span className="mx-4 font-medium tracking-wide">Free delivery on orders above ₹499</span>
            <span className="mx-2 font-medium text-cafe-accent"> • </span>
            <span className="mx-4 flex items-center gap-1"><Phone size={12} /> +91 98765 43210</span>
          </div>
        </div>
      </div>

      {/* Desktop Normal View */}
      <div className="hidden md:flex flex-row justify-between items-center">
        <div className="flex items-center gap-2">
          <MapPin size={14} />
          <span>12 Brew Boulevard, New Delhi</span>
        </div>
        <div className="text-center font-medium tracking-wide">
          Free delivery on orders above ₹499
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Phone size={14} />
            <span>+91 98765 43210</span>
          </div>
          <div className="flex items-center gap-3">
            <InstagramIcon size={14} className="cursor-pointer hover:text-cafe-accent transition-colors" />
            <FacebookIcon size={14} className="cursor-pointer hover:text-cafe-accent transition-colors" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
