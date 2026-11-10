import React from 'react';
import { Send } from 'lucide-react';
import { Link } from 'react-router-dom';

const InstagramIcon = ({ size }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);

const FacebookIcon = ({ size }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);

const TwitterIcon = ({ size }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
);

const Footer = () => {
  return (
    <footer className="bg-cafe-darker text-white pt-8 sm:pt-12 md:pt-16 pb-8 px-4 sm:px-6 md:px-8 text-sm">
      <div className="max-w-8xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 md:gap-12 mb-8 sm:mb-12 md:mb-14 text-center md:text-left">
        
        {/* Brand Info */}
        <div className="lg:col-span-1 flex flex-col items-center md:items-start px-2">
          <div className="flex flex-col items-center md:items-start mb-3 sm:mb-4">
             <span className="font-serif text-2xl sm:text-3xl font-semibold tracking-wide text-[#EFE9DF]">Brew & Bloom</span>
             <span className="text-xs tracking-widest uppercase text-cafe-accent mt-0.5">Cafe</span>
          </div>
          <p className="text-gray-300 font-light leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base max-w-sm md:max-w-[260px]">
            A cozy cafe where great coffee, delicious food, and good vibes come together.
          </p>
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="bg-white/10 p-2.5 rounded-full cursor-pointer hover:bg-cafe-accent transition-colors">
               <InstagramIcon size={18} />
            </div>
            <div className="bg-white/10 p-2.5 rounded-full cursor-pointer hover:bg-cafe-accent transition-colors">
               <FacebookIcon size={18} />
            </div>
            <div className="bg-white/10 p-2.5 rounded-full cursor-pointer hover:bg-cafe-accent transition-colors">
               <TwitterIcon size={18} />
            </div>
          </div>
        </div>

        {/* Quick Links & Help (Balanced 2-column layout on mobile) */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-6 sm:gap-8 md:gap-12 text-left px-4 sm:px-6 md:px-0 max-w-sm sm:max-w-md mx-auto md:max-w-none w-full">
          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white tracking-widest text-xs sm:text-sm uppercase mb-3 sm:mb-4">QUICK LINKS</h4>
            <ul className="space-y-2.5 sm:space-y-3 text-gray-300 font-light text-sm sm:text-base">
              <li><Link to="/" className="hover:text-cafe-accent transition-colors">Home</Link></li>
              <li><Link to="/menu" className="hover:text-cafe-accent transition-colors">Menu</Link></li>
              <li><Link to="/order" className="hover:text-cafe-accent transition-colors">Order Online</Link></li>
              <li><Link to="/book" className="hover:text-cafe-accent transition-colors">Book A Table</Link></li>
              <li><Link to="/gallery" className="hover:text-cafe-accent transition-colors">Gallery</Link></li>
              <li><Link to="/about" className="hover:text-cafe-accent transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-semibold text-white tracking-widest text-xs sm:text-sm uppercase mb-3 sm:mb-4">HELP</h4>
            <ul className="space-y-2.5 sm:space-y-3 text-gray-300 font-light text-sm sm:text-base">
              <li><a href="#" className="hover:text-cafe-accent transition-colors">FAQs</a></li>
              <li><a href="#" className="hover:text-cafe-accent transition-colors">Delivery</a></li>
              <li><a href="#" className="hover:text-cafe-accent transition-colors">Returns</a></li>
              <li><a href="#" className="hover:text-cafe-accent transition-colors">Terms</a></li>
              <li><a href="#" className="hover:text-cafe-accent transition-colors">Privacy</a></li>
            </ul>
          </div>
        </div>

        {/* Contact Us */}
        <div className="lg:col-span-1 flex flex-col items-center md:items-start px-4 sm:px-6 md:px-0 w-full max-w-sm sm:max-w-md mx-auto md:max-w-none">
          <h4 className="font-semibold text-white tracking-widest text-xs sm:text-sm uppercase mb-3 sm:mb-4 text-left w-full">CONTACT US</h4>
          <ul className="space-y-3 text-gray-300 font-light text-sm sm:text-base w-full text-left">
            <li className="flex items-start gap-3">
              <span className="text-cafe-accent mt-0.5 shrink-0"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></span>
              <span>12 Brew Boulevard,<br/>New Delhi 110001</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-cafe-accent shrink-0"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg></span>
              <span>+91 98765 43210</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-cafe-accent shrink-0"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg></span>
              <span>hello@brewandbloom.cafe</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-cafe-accent shrink-0"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></span>
              <span>8:00 AM – 11:00 PM</span>
            </li>
          </ul>
        </div>

        {/* Notifications */}
        <div className="lg:col-span-1 flex flex-col items-center md:items-start px-4 sm:px-6 md:px-0 w-full max-w-sm sm:max-w-md mx-auto md:max-w-none">
           <h4 className="font-semibold text-white tracking-widest text-xs sm:text-sm uppercase mb-3 sm:mb-4 text-left w-full md:w-auto">OFFERS & NOTIFICATIONS</h4>
           <p className="text-gray-300 font-light text-sm mb-4 text-left w-full md:w-auto">
             Get updates on offers & events via Email or WhatsApp.
           </p>
           <div className="flex w-full">
             <input 
               type="text" 
               placeholder="Email or WhatsApp No." 
               className="bg-white/10 border border-gray-600 text-white px-4 py-2.5 w-full text-sm focus:outline-none focus:border-cafe-accent text-left placeholder:text-gray-400 rounded-l-md"
             />
             <button className="bg-cafe-accent text-white px-5 py-2.5 flex items-center justify-center hover:bg-[#A9845B] transition-colors border border-cafe-accent rounded-r-md shrink-0">
               <Send size={16} />
             </button>
           </div>
        </div>

      </div>

      <div className="max-w-8xl mx-auto flex flex-col md:flex-row justify-between items-center pt-6 border-t border-white/10 text-xs sm:text-sm text-gray-400 gap-3">
        <p>Designed by <a href="https://shyvoratechnologies.netlify.app" target="_blank" className="text-cafe-accent font-bold hover:text-white transition-colors">Shyvora Technologies</a></p>
        <div className="flex gap-2">
          {/* Payment Image Containers (Images to be added by user) */}
          <div className="w-12 h-8 bg-white/5 rounded flex items-center justify-center">
             <img src="https://d28wu8o6itv89t.cloudfront.net/images/Visadebitcardpng-1599584312349.png" alt="Visa" className="w-full h-full object-contain" onError={(e) => e.target.style.display = 'none'} />
          </div>
          <div className="w-12 h-8 bg-white/5 rounded flex items-center justify-center">
             <img src="https://logos-world.net/wp-content/uploads/2020/09/MasterCard-Logo-1990-1996.png" alt="Razorpay" className="w-full h-full object-contain" onError={(e) => e.target.style.display = 'none'} />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
