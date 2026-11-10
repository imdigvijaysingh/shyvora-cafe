import React, { useState } from 'react';
import { Calendar, Clock, Users, Armchair, User, Phone, Mail, CalendarPlus, Lock, Check } from 'lucide-react';

const InputField = ({ label, icon: Icon, placeholder, type = "text", optional = false, isSelect = false, options = [], onBlur }) => (
  <div className="flex flex-col gap-2">
    <label className="text-xs font-semibold text-cafe-dark tracking-wide">
      {label} {optional && <span className="text-gray-400 font-normal">(Optional)</span>}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
        <Icon size={16} strokeWidth={1.5} />
      </div>
      {isSelect ? (
        <select className="block w-full pl-10 pr-3 py-3 border border-[#EBE3D5] rounded-sm bg-white focus:outline-none focus:border-cafe-accent text-sm text-gray-700 appearance-none">
          <option value="" disabled selected>{placeholder}</option>
          {options.map((opt, idx) => <option key={idx} value={opt}>{opt}</option>)}
        </select>
      ) : (
        <input 
          type={type} 
          placeholder={placeholder} 
          onBlur={onBlur}
          onChange={(e) => {
            if(type === 'time') e.target.blur();
          }}
          className="block w-full pl-10 pr-3 py-3 border border-[#EBE3D5] rounded-sm bg-white focus:outline-none focus:border-cafe-accent text-sm text-gray-700"
        />
      )}
      {isSelect && (
         <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
         </div>
      )}
    </div>
  </div>
);

const ReservationForm = () => {
  const [isBooked, setIsBooked] = useState(false);

  const handleBookNow = () => {
    setIsBooked(true);
    setTimeout(() => setIsBooked(false), 3000);
  };

  return (
    <div id="reservation-form" className="flex-1 bg-white p-8 md:p-10 rounded-2xl border border-[#EBE3D5] shadow-sm scroll-mt-24">
      <div className="flex items-center gap-4 mb-8">
         <h2 className="font-serif text-[clamp(1.15rem,5vw,1.5rem)] text-cafe-dark uppercase tracking-widest whitespace-nowrap">MAKE A RESERVATION</h2>
      </div>
      
      <div className="text-cafe-accent mb-8 flex items-center">
         <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
         <div className="h-[1px] w-12 bg-cafe-accent/30 ml-2"></div>
      </div>

      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Select Date" icon={Calendar} placeholder="Choose a date" type="date" />
          <InputField label="Select Time" icon={Clock} placeholder="Choose a time" type="time" />
          <InputField label="Number of Guests" icon={Users} placeholder="2 Guests" isSelect options={['1 Guest', '2 Guests', '3 Guests', '4 Guests', '5+ Guests']} />
          <InputField label="Location / Area Preference" icon={Armchair} placeholder="Choose preferred area" optional isSelect options={['Indoor Seating', 'Outdoor Seating', 'Corner Table', 'Private Area']} />
          <InputField label="Your Name" icon={User} placeholder="Enter your name" />
          <InputField label="Phone Number" icon={Phone} placeholder="Enter your phone number" type="tel" />
        </div>
        
        <InputField label="Email Address" icon={Mail} placeholder="Enter your email" type="email" />

        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-cafe-dark tracking-wide">
            Special Request <span className="text-gray-400 font-normal">(Optional)</span>
          </label>
          <textarea 
            placeholder="Any special request or occasion?" 
            rows="3"
            className="block w-full p-3 border border-[#EBE3D5] rounded-sm bg-white focus:outline-none focus:border-cafe-accent text-sm text-gray-700 resize-none"
          ></textarea>
        </div>

        {isBooked ? (
          <button type="button" className="w-full bg-cafe-accent text-white py-4 text-xs font-semibold tracking-widest uppercase rounded-sm flex items-center justify-center gap-2 mt-4 hover:opacity-90 transition-opacity">
            <Check size={16} strokeWidth={3} />
            BOOKED!
          </button>
        ) : (
          <button onClick={handleBookNow} type="button" className="w-full bg-[#132014] text-white py-4 text-xs font-semibold tracking-widest uppercase rounded-sm hover:bg-black transition-colors flex items-center justify-center gap-2 mt-4">
            BOOK NOW
            <CalendarPlus size={16} />
          </button>
        )}
        
        <div className="flex items-center justify-center gap-2 mt-4 text-xs text-text-secondary">
          <Lock size={12} />
          <span>Your details are secure and safe with us.</span>
        </div>
      </form>
    </div>
  );
};

export default ReservationForm;
