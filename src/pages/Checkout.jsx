import React, { useState, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { Clock, Calendar as CalendarIcon, MapPin, Tag, Check, CreditCard, Banknote, X, ArrowLeft } from 'lucide-react';

const Checkout = () => {
  const { cartItems, subtotal, clearCart, addOrder, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  const [step, setStep] = useState('cart');

  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  
  // Pre-booking form state
  const [bookingDate, setBookingDate] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [tableType, setTableType] = useState('standard');
  const [guests, setGuests] = useState(2);

  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  
  const dateRef = useRef(null);
  const timeRef = useRef(null);

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === 'WELCOME20') {
      setDiscount(subtotal * 0.2);
      setCouponApplied(true);
      setCouponError('');
    } else if (couponCode.toUpperCase() === 'CAFE10') {
      setDiscount(subtotal * 0.1);
      setCouponApplied(true);
      setCouponError('');
    } else {
      setCouponError('Invalid coupon code. Try WELCOME20 or CAFE10');
      setCouponApplied(false);
      setDiscount(0);
    }
  };

  const finalTotal = subtotal - discount;

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    
    const newErrors = {};
    if (!bookingDate) newErrors.bookingDate = 'Please select a date.';
    if (!arrivalTime) newErrors.arrivalTime = 'Please select a time.';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      if (!bookingDate && dateRef.current) {
        dateRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (!arrivalTime && timeRef.current) {
        timeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    const order = {
      items: cartItems.map(item => ({ name: item.name, qty: item.quantity })),
      total: (finalTotal + (subtotal * 0.05)).toFixed(2),
      date: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      bookingDate,
      arrivalTime,
      paymentMethod
    };
    
    addOrder(order);
    setErrors({});
    setShowSuccess(true);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
        <h2 className="font-serif text-3xl text-cafe-dark mb-4">Your cart is empty</h2>
        <p className="text-text-secondary mb-8">Add some delicious items to your cart before proceeding.</p>
        <button onClick={() => navigate('/menu')} className="bg-cafe-dark text-white px-8 py-3 rounded-full hover:bg-cafe-accent transition-colors">
          Browse Menu
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 animate-fade-in-up">
        <h1 className="font-serif text-4xl text-cafe-dark mb-8 text-center md:text-left">
          {step === 'cart' ? 'Your Cart' : 'Pre-book & Checkout'}
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Left Column: Form Details */}
          <div className="lg:col-span-2 space-y-8">
            
            {step === 'cart' ? (
              <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm">
                 <h2 className="font-serif text-2xl text-cafe-dark mb-6">Cart Items</h2>
                 <div className="space-y-6">
                   {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 py-4 border-b border-[#EBE3D5] last:border-0 relative">
                        <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover shadow-sm" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-cafe-dark text-lg">{item.name}</h4>
                          <span className="text-sm font-semibold text-cafe-dark">₹{item.price}</span>
                          <div className="flex items-center border border-[#EBE3D5] rounded-md w-fit bg-[#F8F5F0] mt-3">
                             <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-1 text-gray-500 hover:text-cafe-dark">-</button>
                             <span className="px-3 text-sm font-medium border-x border-[#EBE3D5]">{item.quantity}</span>
                             <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 text-gray-500 hover:text-cafe-dark">+</button>
                          </div>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 p-2">
                           <X size={20} />
                        </button>
                      </div>
                   ))}
                 </div>
              </div>
            ) : (
              <>
                {/* Pre-Booking Details */}
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm">
              <h2 className="font-serif text-2xl text-cafe-dark mb-6 flex items-center gap-2">
                <CalendarIcon className="text-cafe-accent" /> Table Pre-booking
              </h2>
              <p className="text-sm text-text-secondary mb-6">Select when you'll arrive. We'll have your food ready and your table reserved!</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div ref={dateRef}>
                  <label className="block text-sm font-medium text-cafe-dark mb-2">Arrival Date</label>
                  <div className="relative">
                    <CalendarIcon size={18} className={`absolute left-3 top-1/2 -translate-y-1/2 ${errors.bookingDate ? 'text-red-400' : 'text-gray-400'}`} />
                    <input 
                      type="date" 
                      required
                      value={bookingDate}
                      onChange={(e) => { setBookingDate(e.target.value); setErrors(prev => ({...prev, bookingDate: null})) }}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:border-cafe-accent bg-transparent transition-colors ${errors.bookingDate ? 'border-red-500 bg-red-50/20' : 'border-[#EBE3D5]'}`}
                    />
                  </div>
                  {errors.bookingDate && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.bookingDate}</p>}
                </div>
                
                <div ref={timeRef}>
                  <label className="block text-sm font-medium text-cafe-dark mb-2">Arrival Time</label>
                  <div className="relative">
                    <Clock size={18} className={`absolute left-3 top-1/2 -translate-y-1/2 ${errors.arrivalTime ? 'text-red-400' : 'text-gray-400'}`} />
                    <input 
                      type="time" 
                      required
                      value={arrivalTime}
                      onChange={(e) => { setArrivalTime(e.target.value); setErrors(prev => ({...prev, arrivalTime: null})) }}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:border-cafe-accent bg-transparent transition-colors ${errors.arrivalTime ? 'border-red-500 bg-red-50/20' : 'border-[#EBE3D5]'}`}
                    />
                  </div>
                  {errors.arrivalTime && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.arrivalTime}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-cafe-dark mb-2">Number of Guests</label>
                  <select 
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="w-full px-4 py-3 border border-[#EBE3D5] rounded-xl focus:outline-none focus:border-cafe-accent bg-transparent appearance-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-cafe-dark mb-2">Table Preference</label>
                  <select 
                    value={tableType}
                    onChange={(e) => setTableType(e.target.value)}
                    className="w-full px-4 py-3 border border-[#EBE3D5] rounded-xl focus:outline-none focus:border-cafe-accent bg-transparent appearance-none"
                  >
                    <option value="standard">Standard Table</option>
                    <option value="window">Window Seat</option>
                    <option value="outdoor">Outdoor Patio</option>
                    <option value="booth">Cozy Booth</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Payment Method */}
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm">
              <h2 className="font-serif text-2xl text-cafe-dark mb-6 flex items-center gap-2">
                <CreditCard className="text-cafe-accent" /> Payment Method
              </h2>
              
              <div className="space-y-4">
                <label className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-colors ${paymentMethod === 'upi' ? 'border-cafe-accent bg-[#F8F5F0]' : 'border-[#EBE3D5] hover:bg-gray-50'}`}>
                  <input 
                    type="radio" 
                    name="payment" 
                    value="upi" 
                    checked={paymentMethod === 'upi'}
                    onChange={() => setPaymentMethod('upi')}
                    className="w-4 h-4 text-cafe-accent accent-cafe-accent"
                  />
                  <div className="flex-grow">
                    <h4 className="font-semibold text-cafe-dark">UPI / Razorpay</h4>
                    <p className="text-xs text-text-secondary">Pay securely via Google Pay, PhonePe, Paytm</p>
                  </div>
                </label>
                
                <label className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-colors ${paymentMethod === 'cafe' ? 'border-cafe-accent bg-[#F8F5F0]' : 'border-[#EBE3D5] hover:bg-gray-50'}`}>
                  <input 
                    type="radio" 
                    name="payment" 
                    value="cafe" 
                    checked={paymentMethod === 'cafe'}
                    onChange={() => setPaymentMethod('cafe')}
                    className="w-4 h-4 text-cafe-accent accent-cafe-accent"
                  />
                  <div className="flex-grow">
                    <h4 className="font-semibold text-cafe-dark">Pay at Cafe</h4>
                    <p className="text-xs text-text-secondary">Pay when you arrive at your pre-booked table</p>
                  </div>
                  <Banknote size={24} className="text-gray-400" />
                </label>
              </div>
            </div>
            
            </>
            )}
            
          </div>
          
          {/* Right Column: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-[#F8F5F0] p-6 rounded-2xl border border-[#EBE3D5] sticky top-24 shadow-sm">
              <h2 className="font-serif text-2xl text-cafe-dark mb-6">Order Summary</h2>
              
              {step === 'booking' && (
                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
                  {cartItems.map((item, index) => (
                    <div key={index} className="flex justify-between items-start gap-4">
                      <div className="flex-grow">
                        <h4 className="font-medium text-cafe-dark text-sm">{item.name}</h4>
                        <p className="text-xs text-text-secondary">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-semibold text-sm text-cafe-dark">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="border-t border-[#EBE3D5] pt-6 mb-6">
                <div className="flex gap-2 mb-2">
                  <input 
                    type="text" 
                    placeholder="Coupon code (e.g., WELCOME20)" 
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-grow px-4 py-2 border border-[#EBE3D5] rounded-lg text-sm focus:outline-none focus:border-cafe-accent bg-white uppercase"
                  />
                  <button 
                    onClick={handleApplyCoupon}
                    className="bg-cafe-dark text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-cafe-accent transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {couponError && <p className="text-red-500 text-xs mb-2 font-medium">{couponError}</p>}
                {couponApplied && (
                  <p className="text-green-600 text-xs flex items-center gap-1"><Check size={12} /> Coupon applied successfully!</p>
                )}
              </div>
              
              <div className="space-y-3 border-t border-[#EBE3D5] pt-6 mb-8 text-sm">
                <div className="flex justify-between text-text-secondary">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Discount</span>
                    <span>-₹{discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-text-secondary">
                  <span>Taxes & Fees</span>
                  <span>₹{(subtotal * 0.05).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-serif text-xl font-bold text-cafe-dark pt-4 border-t border-[#EBE3D5]">
                  <span>Total</span>
                  <span>₹{(finalTotal + (subtotal * 0.05)).toFixed(2)}</span>
                </div>
              </div>
              
              {step === 'cart' ? (
                 <button 
                   onClick={() => {
                     setStep('booking');
                     window.scrollTo({ top: 0, behavior: 'smooth' });
                   }}
                   className="w-full bg-cafe-accent hover:bg-cafe-dark transition-colors text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                 >
                   Proceed to Checkout
                 </button>
              ) : (
                 <div className="flex flex-col gap-3">
                   <button 
                     onClick={handlePlaceOrder}
                     className="w-full bg-cafe-accent hover:bg-cafe-dark transition-colors text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                   >
                     Confirm Pre-booking
                   </button>
                   <button 
                     onClick={() => {
                       setStep('cart');
                       window.scrollTo({ top: 0, behavior: 'smooth' });
                     }}
                     className="w-full bg-transparent border border-cafe-dark text-cafe-dark py-4 rounded-xl font-semibold text-lg hover:bg-cafe-dark hover:text-white transition-colors flex items-center justify-center gap-2"
                   >
                     <ArrowLeft size={20} /> Back to Cart
                   </button>
                 </div>
              )}
            </div>
          </div>
          
        </div>
      </div>
      
      {/* Success Modal Overlay */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
          <div className="relative bg-white rounded-2xl p-8 max-w-sm w-full mx-auto shadow-2xl text-center animate-fade-in-up">
            
            {/* Animated PhonePe style checkmark */}
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 52 52" 
              className="w-16 h-16 mx-auto mb-6 block rounded-full"
              style={{
                strokeWidth: 4, 
                stroke: '#fff', 
                strokeMiterlimit: 10, 
                boxShadow: 'inset 0px 0px 0px #16a34a',
                animation: 'checkmark-fill .4s ease-in-out .4s forwards, checkmark-scale .3s ease-in-out .9s both'
              }}
            >
              <circle 
                cx="26" cy="26" r="25" 
                fill="none" 
                style={{
                  strokeDasharray: 166, 
                  strokeDashoffset: 166, 
                  strokeWidth: 4, 
                  strokeMiterlimit: 10, 
                  stroke: '#16a34a', 
                  fill: 'none', 
                  animation: 'checkmark-stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards'
                }} 
              />
              <path 
                fill="none" 
                d="M14.1 27.2l7.1 7.2 16.7-16.8" 
                style={{
                  transformOrigin: '50% 50%', 
                  strokeDasharray: 48, 
                  strokeDashoffset: 48, 
                  strokeLinecap: 'round',
                  strokeLinejoin: 'round',
                  animation: 'checkmark-stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards'
                }} 
              />
            </svg>

            <h2 className="font-serif text-2xl text-cafe-dark mb-2">Booking Confirmed!</h2>
            <p className="text-sm text-text-secondary mb-6">
              Your table is reserved for <span className="font-semibold text-cafe-dark">{bookingDate}</span> at <span className="font-semibold text-cafe-dark">{arrivalTime}</span>.
            </p>
            <div className="bg-[#F8F5F0] p-4 rounded-xl mb-6 text-sm text-left">
              <div className="flex justify-between mb-2 border-b border-[#EBE3D5] pb-2">
                <span className="text-text-secondary">Amount Paid</span>
                <span className="font-semibold">₹{(finalTotal + (subtotal * 0.05)).toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-text-secondary">Payment Mode</span>
                <span className="font-semibold">{paymentMethod === 'upi' ? 'UPI' : 'Pay at Cafe'}</span>
              </div>
            </div>
            <button 
              onClick={() => {
                clearCart();
                navigate('/');
              }}
              className="w-full bg-cafe-dark text-white py-3 rounded-xl font-semibold hover:bg-cafe-accent transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Checkout;
