import React from 'react';
import { Phone, MessageCircle, CalendarClock } from 'lucide-react';

const HelpReservation = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      <div className="bg-[#F8F5F0] rounded-xl border border-[#EBE3D5] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-8">
        
        <div className="flex items-center gap-6">
          <div className="text-[#A26D51]">
             <CalendarClock size={40} strokeWidth={1} />
          </div>
          <div>
             <h4 className="font-serif text-lg text-cafe-dark mb-1 font-semibold tracking-wide">Need help with your reservation?</h4>
             <p className="text-xs text-text-secondary font-medium">Call us or WhatsApp for immediate assistance.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <a href="tel:+919876543210" className="flex-1 sm:flex-none border border-[#EBE3D5] bg-white text-cafe-dark py-3 px-6 text-[10px] font-semibold tracking-widest uppercase rounded-sm hover:border-cafe-dark transition-colors flex items-center justify-center gap-2">
            <Phone size={14} />
            CALL US
          </a>
          <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="flex-1 sm:flex-none bg-[#132014] text-white py-3 px-6 text-[10px] font-semibold tracking-widest uppercase rounded-sm hover:bg-black transition-colors flex items-center justify-center gap-2">
            <MessageCircle size={14} />
            WHATSAPP US
          </a>
        </div>

      </div>
    </div>
  );
};

export default HelpReservation;
