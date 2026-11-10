import React, { useState } from 'react';
import { X, Info } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useNavigate } from 'react-router-dom';

const CartItem = ({ item, updateQuantity, removeFromCart, formatPrice }) => (
  <div className="flex gap-4 py-4 border-b border-[#EBE3D5] last:border-0 relative group">
    <button 
      onClick={() => removeFromCart(item.id)}
      className="absolute right-0 top-4 text-gray-400 hover:text-red-500 transition-colors"
    >
       <X size={14} />
    </button>
    <img src={item.image} alt={item.name} className="w-14 h-14 rounded-full object-cover shadow-sm" />
    <div className="flex-1 pr-6">
      <div className="flex justify-between items-start mb-2">
         <h4 className="font-semibold text-cafe-dark text-sm">{item.name}</h4>
         <span className="text-xs font-semibold text-cafe-dark">{formatPrice(item.price)}</span>
      </div>
      <div className="flex items-center border border-[#EBE3D5] rounded-md w-fit bg-white">
         <button 
           onClick={() => updateQuantity(item.id, item.quantity - 1)}
           className="px-2 py-0.5 text-gray-500 hover:text-cafe-dark transition-colors"
         >-</button>
         <span className="px-2 text-xs font-medium border-x border-[#EBE3D5]">{item.quantity}</span>
         <button 
           onClick={() => updateQuantity(item.id, item.quantity + 1)}
           className="px-2 py-0.5 text-gray-500 hover:text-cafe-dark transition-colors"
         >+</button>
      </div>
    </div>
  </div>
);

const OrderCart = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, subtotal, totalItems } = useCart();
  const { formatPrice, currency } = useCurrency();
  const [promoCode, setPromoCode] = useState('');
  const navigate = useNavigate();

  const handleApplyPromo = () => {
    if (!promoCode) {
      alert("Please enter a promo code.");
      return;
    }
    alert(`Promo code '${promoCode}' applied successfully!`);
  };

  const showPromoInfo = () => {
    alert(`Available Codes:\n- WELCOME10 (10% off for new users)\n- CAFE20 (20% off on orders above ${formatPrice(500)})\n\nTerms and conditions apply. Coupon code or promo code will be only applicable if the add to the cart exceeds this particular amount of money.`);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }
    navigate('/checkout');
  };

  const deliveryFee = cartItems.length > 0 ? 49 : 0;
  const taxes = cartItems.length > 0 ? Math.round(subtotal * 0.10) : 0; // 10% tax dummy
  const finalTotal = subtotal + deliveryFee + taxes;

  return (
    <div className="w-full lg:w-80 flex-shrink-0">
      <div className="bg-[#F8F5F0] rounded-2xl border border-[#EBE3D5] p-6 sticky top-24">
        
        <div className="flex justify-between items-end mb-6">
           <h3 className="font-serif text-lg text-cafe-dark font-semibold tracking-wide uppercase whitespace-nowrap">YOUR ORDER</h3>
           <button 
             onClick={clearCart}
             className="text-[10px] text-text-secondary hover:text-cafe-dark underline"
           >Clear All</button>
        </div>

        {/* Cart Items List */}
        <div className="mb-6 max-h-[300px] overflow-y-auto no-scrollbar">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <CartItem 
                key={item.id} 
                item={item} 
                updateQuantity={updateQuantity} 
                removeFromCart={removeFromCart} 
                formatPrice={formatPrice}
              />
            ))
          ) : (
            <p className="text-xs text-text-secondary text-center py-4">Your cart is empty.</p>
          )}
        </div>

        {/* Promo Code */}
        <div className="mb-6">
          <div className="flex items-center gap-1 mb-2">
            <p className="text-xs text-text-secondary">Have a promo code?</p>
            <button onClick={showPromoInfo} className="text-cafe-accent hover:text-cafe-dark" title="View Promo Codes">
              <Info size={14} />
            </button>
          </div>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="Enter code" 
              className="flex-1 bg-white border border-[#EBE3D5] rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-cafe-accent uppercase"
            />
            <button 
              onClick={handleApplyPromo}
              className="bg-cafe-darker text-white text-[10px] font-semibold tracking-widest uppercase px-4 rounded-sm hover:bg-cafe-dark transition-colors"
            >
              Apply
            </button>
          </div>
        </div>

        {/* Bill Breakdown */}
        <div className="space-y-3 border-t border-[#EBE3D5] pt-4 mb-4">
          <div className="flex justify-between text-xs text-text-secondary">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal, true)}</span>
          </div>
          <div className="flex justify-between text-xs text-text-secondary">
            <span>Delivery Fee</span>
            <span>{deliveryFee > 0 ? formatPrice(deliveryFee) : (currency === 'INR' ? '₹0' : '$0')}</span>
          </div>
          <div className="flex justify-between text-xs text-text-secondary">
            <span>Taxes & Charges</span>
            <span>{formatPrice(taxes, true)}</span>
          </div>
        </div>

        {/* Total */}
        <div className="flex justify-between items-end border-t border-[#EBE3D5] pt-4 mb-6">
          <span className="font-semibold text-cafe-dark">Total <span className="text-xs font-normal text-text-secondary">({totalItems} items)</span></span>
          <span className="font-semibold text-lg text-cafe-dark">{formatPrice(finalTotal, true)}</span>
        </div>

        {/* Checkout Button */}
        <button 
          onClick={handleCheckout}
          className="w-full bg-[#132014] text-white py-3.5 text-xs font-semibold tracking-widest uppercase rounded-sm hover:bg-black transition-colors mb-4"
        >
          PROCEED TO CHECKOUT
        </button>

      </div>
    </div>
  );
};

export default OrderCart;

