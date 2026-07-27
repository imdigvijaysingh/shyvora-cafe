import React, { useState } from 'react';
import { Calendar, Users, MapPin, Clock } from 'lucide-react';

const ReservationCard = ({ date, time, guests, area, status }) => (
  <div className="border border-[#EBE3D5] rounded-xl p-5 mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 bg-[#F8F5F0] rounded-lg border border-[#EBE3D5] flex flex-col items-center justify-center flex-shrink-0 text-cafe-dark">
        <span className="text-xs font-semibold uppercase">{date.split(' ')[0]}</span>
        <span className="text-lg font-bold leading-none">{date.split(' ')[1]}</span>
      </div>
      <div>
        <h4 className="font-semibold text-cafe-dark text-sm mb-1">Table Reservation</h4>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-secondary">
          <span className="flex items-center gap-1"><Clock size={12} /> {time}</span>
          <span className="flex items-center gap-1"><Users size={12} /> {guests} Guests</span>
          <span className="flex items-center gap-1"><MapPin size={12} /> {area}</span>
        </div>
      </div>
    </div>
    
    <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
      <div className={`px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-widest ${
        status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
      }`}>
        {status}
      </div>
      {status === 'Confirmed' && (
        <button className="text-[10px] font-semibold text-red-600 uppercase tracking-widest hover:underline underline-offset-4">Cancel</button>
      )}
    </div>
  </div>
);

const MyReservations = () => {
  const [activeTab, setActiveTab] = useState('upcoming');

  const upcomingRes = [
    { date: 'Aug 14', time: '19:30 PM', guests: 2, area: 'Corner Table', status: 'Confirmed' }
  ];

  const pastRes = [
    { date: 'Jul 02', time: '20:00 PM', guests: 4, area: 'Indoor Seating', status: 'Completed' },
    { date: 'Jun 15', time: '18:00 PM', guests: 2, area: 'Outdoor Seating', status: 'Completed' }
  ];

  const currentList = activeTab === 'upcoming' ? upcomingRes : pastRes;

  return (
    <div>
      <h2 className="font-serif text-2xl text-cafe-dark mb-6">My Reservations</h2>
      
      {/* Tabs */}
      <div className="flex border-b border-[#EBE3D5] mb-6">
        <button 
          onClick={() => setActiveTab('upcoming')}
          className={`pb-3 px-4 text-sm font-semibold transition-colors relative ${activeTab === 'upcoming' ? 'text-cafe-dark' : 'text-gray-400 hover:text-gray-600'}`}
        >
          Upcoming
          {activeTab === 'upcoming' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-cafe-accent"></div>}
        </button>
        <button 
          onClick={() => setActiveTab('past')}
          className={`pb-3 px-4 text-sm font-semibold transition-colors relative ${activeTab === 'past' ? 'text-cafe-dark' : 'text-gray-400 hover:text-gray-600'}`}
        >
          Past
          {activeTab === 'past' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-cafe-accent"></div>}
        </button>
      </div>

      {/* List */}
      <div>
        {currentList.length > 0 ? (
          currentList.map((res, idx) => <ReservationCard key={idx} {...res} />)
        ) : (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
              <Calendar size={24} />
            </div>
            <h4 className="font-semibold text-cafe-dark mb-1">No {activeTab} reservations found.</h4>
            <p className="text-xs text-text-secondary">Book a table to see it here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReservations;
