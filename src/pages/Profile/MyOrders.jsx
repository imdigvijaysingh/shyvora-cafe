import React, { useState, useEffect } from 'react';
import { FileText, Clock, CheckCircle2, Timer } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const OrderItem = ({ id, date, items, total, status, bookingDate, arrivalTime }) => {
  const [timeLeft, setTimeLeft] = useState('');
  
  useEffect(() => {
    if (status !== 'Confirmed' || !bookingDate || !arrivalTime) return;
    
    const [hours, minutes] = arrivalTime.split(':');
    const targetDate = new Date(bookingDate);
    targetDate.setHours(parseInt(hours, 10));
    targetDate.setMinutes(parseInt(minutes, 10));
    targetDate.setSeconds(0);
    
    const updateTimer = () => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeLeft('Time Reached');
        return;
      }
      
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      
      let str = '';
      if (d > 0) str += `${d}d `;
      if (h > 0 || d > 0) str += `${h}h `;
      str += `${m}m ${s}s`;
      setTimeLeft(str);
    };
    
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [bookingDate, arrivalTime, status]);

  return (
    <div className="border border-[#EBE3D5] rounded-xl p-5 mb-4 animate-fade-in-up">
      <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-100">
        <div>
          <h4 className="font-semibold text-cafe-dark text-sm mb-1">Order #{id}</h4>
          <p className="text-xs text-text-secondary flex items-center gap-1">
            <Clock size={12} /> {date}
          </p>
        </div>
        <div className="flex flex-col items-end">
          <div className={`px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-widest ${
            status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
          }`}>
            {status}
          </div>
          {status === 'Confirmed' && timeLeft && (
            <div className="flex items-center gap-1 text-[11px] font-semibold text-cafe-accent mt-2 bg-cafe-accent/10 px-2 py-0.5 rounded-md">
              <Timer size={12} /> In {timeLeft}
            </div>
          )}
        </div>
      </div>
      
      {showDetails && (
        <div className="mb-4 pt-4 border-t border-gray-100 animate-fade-in">
          <h5 className="font-semibold text-xs text-cafe-dark mb-2">Order Items</h5>
          {items && items.map((item, idx) => (
            <p key={idx} className="text-sm text-text-secondary mb-1 flex justify-between">
              <span><span className="font-medium text-gray-700">{item.qty}x</span> {item.name}</span>
            </p>
          ))}
          {bookingDate && (
            <div className="mt-3 pt-3 border-t border-gray-50 text-xs text-text-secondary">
              <p>Booking Date: <span className="font-medium text-gray-700">{new Date(bookingDate).toLocaleDateString()}</span></p>
              <p>Arrival Time: <span className="font-medium text-gray-700">{arrivalTime}</span></p>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <div className="text-sm text-text-secondary">Total: <span className="font-semibold text-cafe-dark text-base">₹{total}</span></div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowDetails(!showDetails)}
            className="text-[10px] font-semibold text-cafe-dark uppercase tracking-widest hover:text-cafe-accent underline underline-offset-4"
          >
            {showDetails ? 'Hide Details' : 'View Details'}
          </button>
        </div>
      </div>
    </div>
  );
};

const MyOrders = () => {
  const { orders } = useCart();
  const [activeTab, setActiveTab] = useState('active');

  const activeOrdersContext = orders.filter(o => o.status !== 'Delivered');
  const pastOrdersContext = orders.filter(o => o.status === 'Delivered');

  const activeOrders = activeOrdersContext.length > 0 ? activeOrdersContext : [];
  const pastOrders = pastOrdersContext.length > 0 ? pastOrdersContext : [
    { id: '09831', date: '15 July 2026, 10:30 AM', items: [{qty: 1, name: 'Iced Caramel Latte'}, {qty: 1, name: 'Chocolate Brownie'}], total: 418, status: 'Delivered' },
    { id: '08742', date: '10 July 2026, 06:15 PM', items: [{qty: 2, name: 'Aglio Olio Pasta'}], total: 518, status: 'Delivered' }
  ];

  const currentList = activeTab === 'active' ? activeOrders : pastOrders;

  return (
    <div>
      <h2 className="font-serif text-2xl text-cafe-dark mb-6">My Orders</h2>
      
      {/* Tabs */}
      <div className="flex border-b border-[#EBE3D5] mb-6">
        <button 
          onClick={() => setActiveTab('active')}
          className={`pb-3 px-4 text-sm font-semibold transition-colors relative ${activeTab === 'active' ? 'text-cafe-dark' : 'text-gray-400 hover:text-gray-600'}`}
        >
          Active Orders
          {activeTab === 'active' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-cafe-accent"></div>}
        </button>
        <button 
          onClick={() => setActiveTab('past')}
          className={`pb-3 px-4 text-sm font-semibold transition-colors relative ${activeTab === 'past' ? 'text-cafe-dark' : 'text-gray-400 hover:text-gray-600'}`}
        >
          Past Orders
          {activeTab === 'past' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-cafe-accent"></div>}
        </button>
      </div>

      {/* List */}
      <div>
        {currentList.length > 0 ? (
          currentList.map((order, idx) => <OrderItem key={idx} {...order} />)
        ) : (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
              <FileText size={24} />
            </div>
            <h4 className="font-semibold text-cafe-dark mb-1">No {activeTab} orders found.</h4>
            <p className="text-xs text-text-secondary">When you place an order, it will appear here.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default MyOrders;
