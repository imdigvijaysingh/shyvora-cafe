import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { useCafeData } from '../context/CafeDataContext';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  MessageSquare, 
  ShoppingBag, 
  Tag, 
  Check, 
  Clock, 
  MapPin, 
  Coffee, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowLeft,
  UtensilsCrossed,
  Truck
} from 'lucide-react';
import InvoiceModal from '../components/InvoiceModal';

const Checkout = () => {
  const { cartItems, subtotal, clearCart, updateQuantity, removeFromCart } = useCart();
  const { formatPrice, currency } = useCurrency();
  const { settings, API_URL } = useCafeData();
  const navigate = useNavigate();

  // Customer Form state - default to Takeaway as most customers place quick food orders
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderType, setOrderType] = useState('Takeaway');
  const [tableOrAddress, setTableOrAddress] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');

  // Payment method selection: 'razorpay' or 'whatsapp_counter'
  const [paymentChoice, setPaymentChoice] = useState('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);

  // Promo code
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');

  // Invoice Modal state
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [currentOrderData, setCurrentOrderData] = useState(null);
  const [errors, setErrors] = useState({});

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    const seasonalCode = settings?.seasonalTheme?.discountCode?.toUpperCase();

    if (code === 'WELCOME20' || (seasonalCode && code === seasonalCode)) {
      setDiscount(subtotal * 0.2);
      setCouponApplied(true);
      setCouponError('');
    } else if (code === 'CAFE10') {
      setDiscount(subtotal * 0.1);
      setCouponApplied(true);
      setCouponError('');
    } else {
      setCouponError('Invalid coupon code. Try WELCOME20 or CAFE10');
      setCouponApplied(false);
      setDiscount(0);
    }
  };

  const deliveryFee = orderType === 'Delivery' ? (currency === 'INR' ? 40 : 1.5) : 0;
  const finalTotal = Math.max(0, subtotal - discount + deliveryFee);

  const validateForm = () => {
    const errs = {};
    if (!customerName.trim()) errs.customerName = 'Please enter your name.';
    if (!customerPhone.trim() || customerPhone.replace(/[^0-9]/g, '').length < 8) {
      errs.customerPhone = 'Please enter a valid phone number.';
    }
    // For Delivery, address is required.
    // For Takeaway and Dine-in, customer can order smoothly without rigid requirements.
    if (orderType === 'Delivery' && !tableOrAddress.trim()) {
      errs.tableOrAddress = 'Please enter your delivery address.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Helper to load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Complete Order
  const handleProceed = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (cartItems.length === 0) return;

    setIsProcessing(true);
    const invoiceId = `INV-${Date.now().toString().slice(-6)}`;

    // OPTION A: PAY ONLINE VIA RAZORPAY
    if (paymentChoice === 'razorpay') {
      try {
        // Create order on backend
        const res = await fetch(`${API_URL}/api/payment/create-order`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: finalTotal,
            currency: currency === 'USD' ? 'USD' : 'INR',
            receipt: invoiceId,
            notes: { customerName, customerPhone, orderType }
          })
        }).catch(() => null);

        let orderInfo = null;
        if (res && res.ok) {
          orderInfo = await res.json();
        }

        const isScriptLoaded = await loadRazorpayScript();

        // If Razorpay SDK loaded and real key provided
        if (isScriptLoaded && orderInfo && orderInfo.keyId && !orderInfo.keyId.includes('mock') && !orderInfo.keyId.includes('placeholder')) {
          const options = {
            key: orderInfo.keyId,
            amount: orderInfo.order.amount,
            currency: orderInfo.order.currency,
            name: settings?.cafeName || 'Brew & Bloom Cafe',
            description: `Order ${invoiceId}`,
            image: '/favicon.ico',
            order_id: orderInfo.order.id,
            handler: function (response) {
              finalizeOrder({
                invoiceId,
                paymentMethod: 'Razorpay Online',
                paymentStatus: 'Paid',
                paymentId: response.razorpay_payment_id
              });
            },
            prefill: {
              name: customerName,
              contact: customerPhone
            },
            theme: { color: '#1A2C21' }
          };

          const rzp = new window.Razorpay(options);
          rzp.open();
          setIsProcessing(false);
          return;
        }

        // Test/Demo Sandbox Mode
        setTimeout(() => {
          finalizeOrder({
            invoiceId,
            paymentMethod: 'Razorpay Online (Test)',
            paymentStatus: 'Paid via Razorpay (Test)',
            paymentId: `pay_test_${Date.now().toString().slice(-8)}`
          });
          setIsProcessing(false);
        }, 800);

      } catch (err) {
        console.error('Payment error:', err);
        finalizeOrder({
          invoiceId,
          paymentMethod: 'Razorpay Online',
          paymentStatus: 'Paid (Test Reference)',
          paymentId: `pay_${Date.now().toString().slice(-8)}`
        });
        setIsProcessing(false);
      }
    } 
    // OPTION B: DIRECT ORDER (PAY AT COUNTER / WHATSAPP COD)
    else {
      finalizeOrder({
        invoiceId,
        paymentMethod: orderType === 'Delivery' ? 'Cash on Delivery' : 'Pay at Counter',
        paymentStatus: 'Pay at Counter / Unpaid',
        paymentId: null
      });
      setIsProcessing(false);
    }
  };

  const finalizeOrder = (paymentMeta) => {
    // Resolve location: If dine-in and nothing typed, default to 'Any Available Table'
    const resolvedLocation = orderType === 'Dine-in'
      ? (tableOrAddress.trim() || 'Any Available Table')
      : tableOrAddress.trim();

    const orderData = {
      invoiceId: paymentMeta.invoiceId,
      customerName,
      customerPhone,
      orderType,
      tableOrAddress: resolvedLocation,
      specialNotes,
      items: cartItems.map(item => ({
        name: item.name || item.title,
        price: item.price,
        quantity: item.quantity
      })),
      subtotal,
      deliveryFee,
      discount,
      total: finalTotal,
      paymentMethod: paymentMeta.paymentMethod,
      paymentStatus: paymentMeta.paymentStatus,
      paymentId: paymentMeta.paymentId,
      date: new Date().toLocaleString()
    };

    setCurrentOrderData(orderData);
    setIsInvoiceOpen(true);
    clearCart();
  };

  if (cartItems.length === 0 && !isInvoiceOpen) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center bg-cafe-bg">
        <div className="w-16 h-16 rounded-full bg-cafe-darker/5 flex items-center justify-center text-cafe-accent mb-4">
          <ShoppingBag size={28} />
        </div>
        <h2 className="font-serif text-3xl text-cafe-dark mb-2">Your Cart is Empty</h2>
        <p className="text-text-secondary mb-6 text-sm max-w-sm">
          Explore our handcrafted coffees, artisan breakfast, and desserts to start your order.
        </p>
        <button 
          onClick={() => navigate('/menu')} 
          className="bg-cafe-accent text-white px-8 py-3 rounded-xl font-semibold text-sm hover:bg-[#A88358] transition-all shadow-md"
        >
          Browse Our Menu
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-10 bg-cafe-bg min-h-screen">
        
        {/* Back Link */}
        <button 
          onClick={() => navigate('/menu')} 
          className="flex items-center gap-2 text-xs font-semibold text-cafe-dark hover:text-cafe-accent mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Continue Browsing Menu
        </button>

        <h1 className="font-serif text-[clamp(1.35rem,5.5vw,2.5rem)] text-cafe-dark mb-2 whitespace-nowrap">
          Review & Place Order
        </h1>
        <p className="text-text-secondary text-xs sm:text-sm mb-8">
          Order directly with instant WhatsApp confirmation to our cafe barista.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Customer Details & Payment Options (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. Customer Information Card */}
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#EBE3D5] shadow-sm">
              <h2 className="font-serif text-xl font-semibold text-cafe-dark mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-cafe-accent text-white text-xs flex items-center justify-center font-sans">1</span>
                Your Details
              </h2>

              <div className="space-y-4 text-xs sm:text-sm">
                <div>
                  <label className="block text-cafe-dark font-medium mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. John Doe"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#EBE3D5] focus:outline-none focus:border-cafe-accent bg-white text-cafe-dark text-sm"
                  />
                  {errors.customerName && <p className="text-red-500 text-xs mt-1">{errors.customerName}</p>}
                </div>

                <div>
                  <label className="block text-cafe-dark font-medium mb-1">Phone / WhatsApp Number *</label>
                  <input
                    type="tel"
                    placeholder="e.g. 9876543210"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#EBE3D5] focus:outline-none focus:border-cafe-accent bg-white text-cafe-dark text-sm"
                  />
                  {errors.customerPhone && <p className="text-red-500 text-xs mt-1">{errors.customerPhone}</p>}
                  <span className="text-[11px] text-text-secondary mt-1 block">Your invoice & order updates will be sent to this number.</span>
                </div>

                {/* Order Type / Dining Preference with Radio Buttons */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-cafe-dark font-medium text-xs sm:text-sm">
                      Select Order & Dining Preference *
                    </label>
                    <span className="text-[11px] text-text-secondary">Choose option</span>
                  </div>

                  {/* Radio Options Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    
                    {/* Option 1: Takeaway (Most Common) */}
                    <label 
                      className={`relative flex flex-col p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                        orderType === 'Takeaway' 
                          ? 'border-cafe-accent bg-cafe-accent/5 ring-1 ring-cafe-accent/30 shadow-xs' 
                          : 'border-[#EBE3D5] bg-[#FDFBF7] hover:border-[#D6C7B2]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="orderType"
                            value="Takeaway"
                            checked={orderType === 'Takeaway'}
                            onChange={() => {
                              setOrderType('Takeaway');
                              setTableOrAddress('');
                            }}
                            className="w-4 h-4 text-cafe-accent focus:ring-cafe-accent accent-cafe-accent cursor-pointer"
                          />
                          <span className="font-semibold text-cafe-dark text-xs sm:text-sm flex items-center gap-1.5">
                            <ShoppingBag size={15} className="text-cafe-accent shrink-0" />
                            Takeaway
                          </span>
                        </div>
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                          Quick
                        </span>
                      </div>
                      <p className="text-[11px] text-text-secondary leading-snug">
                        Just book food & drinks, ready to pick up at counter.
                      </p>
                    </label>

                    {/* Option 2: Dine-In with Table Preference */}
                    <label 
                      className={`relative flex flex-col p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                        orderType === 'Dine-in' 
                          ? 'border-cafe-accent bg-cafe-accent/5 ring-1 ring-cafe-accent/30 shadow-xs' 
                          : 'border-[#EBE3D5] bg-[#FDFBF7] hover:border-[#D6C7B2]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="orderType"
                            value="Dine-in"
                            checked={orderType === 'Dine-in'}
                            onChange={() => setOrderType('Dine-in')}
                            className="w-4 h-4 text-cafe-accent focus:ring-cafe-accent accent-cafe-accent cursor-pointer"
                          />
                          <span className="font-semibold text-cafe-dark text-xs sm:text-sm flex items-center gap-1.5">
                            <UtensilsCrossed size={15} className="text-cafe-accent shrink-0" />
                            Dine-In
                          </span>
                        </div>
                        <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                          At Cafe
                        </span>
                      </div>
                      <p className="text-[11px] text-text-secondary leading-snug">
                        Dine at the cafe with your preferred table / seating.
                      </p>
                    </label>

                    {/* Option 3: Delivery */}
                    <label 
                      className={`relative flex flex-col p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                        orderType === 'Delivery' 
                          ? 'border-cafe-accent bg-cafe-accent/5 ring-1 ring-cafe-accent/30 shadow-xs' 
                          : 'border-[#EBE3D5] bg-[#FDFBF7] hover:border-[#D6C7B2]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="orderType"
                            value="Delivery"
                            checked={orderType === 'Delivery'}
                            onChange={() => setOrderType('Delivery')}
                            className="w-4 h-4 text-cafe-accent focus:ring-cafe-accent accent-cafe-accent cursor-pointer"
                          />
                          <span className="font-semibold text-cafe-dark text-xs sm:text-sm flex items-center gap-1.5">
                            <Truck size={15} className="text-cafe-accent shrink-0" />
                            Delivery
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-text-secondary">
                          {currency === 'INR' ? '+₹40' : '+$1.50'}
                        </span>
                      </div>
                      <p className="text-[11px] text-text-secondary leading-snug">
                        Doorstep delivery straight to your address.
                      </p>
                    </label>

                  </div>
                </div>

                {/* Dynamic Contextual Input Section */}
                {/* 1. Dine-In: Table Preference */}
                {orderType === 'Dine-in' && (
                  <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#EBE3D5] space-y-3 animate-fade-in-up">
                    <div className="flex items-center justify-between">
                      <label className="block text-cafe-dark font-medium text-xs sm:text-sm">
                        Table Preference / Seating Area
                      </label>
                      <span className="text-[11px] text-cafe-accent font-semibold bg-cafe-accent/10 px-2 py-0.5 rounded-full">
                        Table Preference
                      </span>
                    </div>

                    <p className="text-[11px] text-text-secondary">
                      Select your preferred seating spot or enter a table number if you are already seated:
                    </p>

                    {/* Table Preference Quick Chips */}
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        '🪟 Window Side',
                        '🌿 Outdoor Garden',
                        '🛋️ Cozy Booth',
                        '☕ Indoor Ambiance',
                        '✨ Any Available Table'
                      ].map(pref => (
                        <button
                          key={pref}
                          type="button"
                          onClick={() => setTableOrAddress(pref)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            tableOrAddress === pref 
                              ? 'bg-cafe-accent text-white shadow-xs font-semibold' 
                              : 'bg-white text-cafe-dark border border-[#EBE3D5] hover:border-cafe-accent'
                          }`}
                        >
                          {pref}
                        </button>
                      ))}
                    </div>

                    <input
                      type="text"
                      placeholder="e.g. Table 4, Window Side, or Quiet Corner"
                      value={tableOrAddress}
                      onChange={(e) => setTableOrAddress(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#EBE3D5] focus:outline-none focus:border-cafe-accent bg-white text-cafe-dark text-xs sm:text-sm"
                    />
                    <span className="text-[11px] text-text-secondary block">
                      Leave blank or select "Any Available Table" if you don't have a specific table yet.
                    </span>
                  </div>
                )}

                {/* 2. Takeaway: Quick Pickup Timing (Optional) */}
                {orderType === 'Takeaway' && (
                  <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#EBE3D5] space-y-2.5 animate-fade-in-up">
                    <div className="flex items-center justify-between">
                      <label className="block text-cafe-dark font-medium text-xs sm:text-sm">
                        Pickup Timing / Counter Note (Optional)
                      </label>
                      <span className="text-[11px] text-text-secondary">No table required</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {[
                        '⚡ Ready ASAP (15 mins)',
                        '🕒 In 30 mins',
                        '🚶 I am on my way'
                      ].map(time => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setTableOrAddress(time)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            tableOrAddress === time 
                              ? 'bg-cafe-accent text-white shadow-xs font-semibold' 
                              : 'bg-white text-cafe-dark border border-[#EBE3D5] hover:border-cafe-accent'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>

                    <input
                      type="text"
                      placeholder="e.g. Ready in 15 mins, or Pick up after 4:30 PM"
                      value={tableOrAddress}
                      onChange={(e) => setTableOrAddress(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#EBE3D5] focus:outline-none focus:border-cafe-accent bg-white text-cafe-dark text-xs sm:text-sm"
                    />
                  </div>
                )}

                {/* 3. Delivery: Delivery Address (Required) */}
                {orderType === 'Delivery' && (
                  <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#EBE3D5] space-y-2.5 animate-fade-in-up">
                    <label className="block text-cafe-dark font-medium text-xs sm:text-sm">
                      Delivery Address *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Flat 402, Green Avenue, Landmark near City Mall"
                      value={tableOrAddress}
                      onChange={(e) => setTableOrAddress(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#EBE3D5] focus:outline-none focus:border-cafe-accent bg-white text-cafe-dark text-xs sm:text-sm"
                    />
                    {errors.tableOrAddress && <p className="text-red-500 text-xs mt-1">{errors.tableOrAddress}</p>}
                  </div>
                )}

                {/* Special Instructions */}
                <div>
                  <label className="block text-cafe-dark font-medium mb-1">Special Cooking Instructions (Optional)</label>
                  <textarea
                    rows="2"
                    placeholder="e.g. Less sugar, extra hot milk, no onions..."
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-[#EBE3D5] focus:outline-none focus:border-cafe-accent bg-white text-cafe-dark text-xs sm:text-sm resize-none"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* 2. Payment Method Card */}
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#EBE3D5] shadow-sm">
              <h2 className="font-serif text-xl font-semibold text-cafe-dark mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-cafe-accent text-white text-xs flex items-center justify-center font-sans">2</span>
                Choose Payment Method
              </h2>

              <div className="space-y-3">
                {/* Razorpay Online */}
                <label 
                  onClick={() => setPaymentChoice('razorpay')}
                  className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentChoice === 'razorpay'
                      ? 'border-cafe-accent bg-[#FDFBF7] shadow-sm'
                      : 'border-[#EBE3D5] hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentChoice"
                    checked={paymentChoice === 'razorpay'}
                    onChange={() => setPaymentChoice('razorpay')}
                    className="mt-1 accent-cafe-accent"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-cafe-dark text-sm">Pay Online via Razorpay</span>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                        Cards / UPI / NetBanking
                      </span>
                    </div>
                    <p className="text-text-secondary text-xs mt-1">
                      Pay securely online. Upon completion, an instant verified invoice is generated and sent to WhatsApp.
                    </p>
                  </div>
                </label>

                {/* Pay at Counter / WhatsApp Direct */}
                <label 
                  onClick={() => setPaymentChoice('whatsapp_counter')}
                  className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentChoice === 'whatsapp_counter'
                      ? 'border-cafe-accent bg-[#FDFBF7] shadow-sm'
                      : 'border-[#EBE3D5] hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentChoice"
                    checked={paymentChoice === 'whatsapp_counter'}
                    onChange={() => setPaymentChoice('whatsapp_counter')}
                    className="mt-1 accent-cafe-accent"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-cafe-dark text-sm">
                        {orderType === 'Delivery' ? 'Cash on Delivery' : 'Pay at Counter / Table'}
                      </span>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        Direct Order
                      </span>
                    </div>
                    <p className="text-text-secondary text-xs mt-1">
                      No online payment required now. Place order directly and send order details instantly to the cafe owner on WhatsApp.
                    </p>
                  </div>
                </label>
              </div>

              {/* Submit CTA */}
              <button
                type="button"
                onClick={handleProceed}
                disabled={isProcessing}
                className="w-full mt-6 py-4 px-6 bg-cafe-dark hover:bg-cafe-accent text-white font-bold text-sm sm:text-base rounded-xl transition-all shadow-lg flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Processing Order...
                  </span>
                ) : paymentChoice === 'razorpay' ? (
                  <>
                    <CreditCard size={18} />
                    <span>Pay {formatPrice(finalTotal)} via Razorpay</span>
                  </>
                ) : (
                  <>
                    <MessageSquare size={18} />
                    <span>Place Order & Open WhatsApp Bill</span>
                  </>
                )}
              </button>
            </div>

          </div>

          {/* RIGHT: Cart Summary & Coupon (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Order Items Review */}
            <div className="bg-white p-6 rounded-2xl border border-[#EBE3D5] shadow-sm">
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-[#EBE3D5]">
                <h3 className="font-serif text-lg font-semibold text-cafe-dark">Order Items ({cartItems.length})</h3>
                <span className="text-xs text-text-secondary">{currency} Prices</span>
              </div>

              <div className="divide-y divide-[#EBE3D5]/60 max-h-[320px] overflow-y-auto pr-1 no-scrollbar">
                {cartItems.map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between gap-3 text-xs sm:text-sm">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {item.image && (
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-12 h-12 rounded-lg object-cover border border-gray-100 shrink-0" 
                        />
                      )}
                      <div className="truncate">
                        <p className="font-semibold text-cafe-dark truncate">{item.name}</p>
                        <p className="text-text-secondary text-xs">{formatPrice(item.price)} each</p>
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 border border-[#EBE3D5] rounded-lg p-1 bg-[#F8F5F0]">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:text-cafe-accent text-cafe-dark"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="font-semibold text-xs w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:text-cafe-accent text-cafe-dark"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <span className="font-bold text-cafe-dark text-xs sm:text-sm shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Coupon Box */}
              <div className="mt-4 pt-4 border-t border-[#EBE3D5]">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Promo code (e.g. WELCOME20)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 px-3 py-2 border border-[#EBE3D5] rounded-xl text-xs uppercase focus:outline-none focus:border-cafe-accent bg-white"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 bg-cafe-accent hover:bg-[#A88358] text-white text-xs font-semibold rounded-xl transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {couponApplied && (
                  <p className="text-emerald-600 text-xs mt-1.5 flex items-center gap-1">
                    <Check size={14} /> Coupon applied successfully!
                  </p>
                )}
                {couponError && <p className="text-red-500 text-xs mt-1.5">{couponError}</p>}
              </div>

              {/* Breakdown */}
              <div className="mt-4 pt-4 border-t border-[#EBE3D5] space-y-2 text-xs sm:text-sm text-text-secondary">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {couponApplied && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Discount:</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                {orderType === 'Delivery' && (
                  <div className="flex justify-between">
                    <span>Delivery Charge:</span>
                    <span>{formatPrice(deliveryFee)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base sm:text-lg font-bold text-cafe-dark pt-3 border-t border-[#EBE3D5]">
                  <span>Total Amount:</span>
                  <span className="text-cafe-accent font-serif">{formatPrice(finalTotal)}</span>
                </div>
              </div>

            </div>

            {/* Direct Owner Notification Note */}
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-start gap-3">
              <MessageSquare size={18} className="text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block mb-0.5">Instant WhatsApp Order Dispatch</span>
                <p className="text-[11px] leading-relaxed">
                  As soon as you place your order, your itemized invoice is generated with a 1-tap WhatsApp button to send details straight to our owner at <strong>+91 {settings?.whatsappNumber || '9458082654'}</strong>.
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Invoice Receipt Modal */}
      <InvoiceModal
        isOpen={isInvoiceOpen}
        onClose={() => {
          setIsInvoiceOpen(false);
          navigate('/');
        }}
        orderData={currentOrderData}
      />
    </>
  );
};

export default Checkout;
