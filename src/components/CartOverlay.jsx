import React from 'react';
import { ShoppingBag, ChevronRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartOverlay = () => {
  const { totalItems, subtotal } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  if (totalItems === 0 || location.pathname === '/checkout') return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 animate-fade-in-up">
      <div className="max-w-4xl mx-auto bg-cafe-darker text-white rounded-2xl p-4 flex items-center justify-between shadow-2xl border border-gray-800">
        <div className="flex items-center gap-4">
          <div className="relative">
            <ShoppingBag size={24} className="text-cafe-accent" />
            <span className="absolute -top-2 -right-2 bg-white text-cafe-dark text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
              {totalItems}
            </span>
          </div>
          <div>
            <p className="text-xs text-gray-300 font-medium">Total Amount</p>
            <p className="font-sans text-xl font-bold tracking-wide">₹{subtotal}</p>
          </div>
        </div>
        
        <button 
          onClick={() => navigate('/checkout')}
          className="bg-cafe-accent hover:bg-white hover:text-cafe-darker transition-colors text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 group"
        >
          Checkout
          <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default CartOverlay;
