import React from 'react';
import { Heart, Plus, Minus } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useCurrency } from '../../context/CurrencyContext';

const OrderItemCard = ({ image, title, description, price }) => {
  const { addToCart, cartItems, updateQuantity } = useCart();
  const { formatPrice } = useCurrency();
  
  const cartItem = cartItems.find(item => item.id === title);
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = () => {
    addToCart({ id: title, name: title, price: parseFloat(price.toString().replace(/,/g, '')), image });
  };

  const handleDecrement = () => {
    updateQuantity(title, quantity - 1);
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-[#EBE3D5] flex flex-col group relative">
      {/* Favorite Button */}
      <button className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors">
        <Heart size={16} strokeWidth={2} />
      </button>

      {/* Image */}
      <div className="h-48 overflow-hidden">
        <img loading="lazy" 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-cafe-dark text-sm mb-1">{title}</h3>
        <p className="text-xs text-text-secondary line-clamp-2 mb-4 font-medium">{description}</p>
        
        <div className="mt-auto flex items-center justify-between">
          <span className="font-semibold text-cafe-dark">{formatPrice(price)}</span>
          {quantity > 0 ? (
            <div className="flex items-center bg-cafe-accent text-white rounded-sm h-[28px]">
              <button 
                onClick={handleDecrement}
                className="w-7 h-full flex items-center justify-center hover:bg-black/10 transition-colors"
              >
                <Minus size={14} strokeWidth={3} />
              </button>
              <span className="text-[12px] font-semibold w-6 text-center">
                {quantity}
              </span>
              <button 
                onClick={handleAddToCart}
                className="w-7 h-full flex items-center justify-center hover:bg-black/10 transition-colors"
              >
                <Plus size={14} strokeWidth={3} />
              </button>
            </div>
          ) : (
            <button 
              onClick={handleAddToCart}
              className="bg-cafe-darker text-white text-[10px] font-semibold tracking-widest uppercase px-4 py-1.5 rounded-sm hover:bg-cafe-dark transition-colors h-[28px]"
            >
              ADD
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderItemCard;
