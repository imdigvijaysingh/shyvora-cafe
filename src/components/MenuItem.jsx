import React from 'react';
import { Plus, Minus, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

const MenuItem = ({ image, name, description, price }) => {
  const { addToCart, updateQuantity, cartItems } = useCart();

  const cartItem = cartItems.find(item => item.id === name);
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart({ id: name, name, price: parseFloat(price.toString().replace(/,/g, '')), image });
  };

  const handleIncrement = (e) => {
    e.stopPropagation();
    updateQuantity(name, quantity + 1);
  };

  const handleDecrement = (e) => {
    e.stopPropagation();
    updateQuantity(name, quantity - 1);
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col h-full group cursor-pointer relative pb-4">
      <div className="h-48 overflow-hidden relative">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-serif text-lg font-semibold text-cafe-dark mb-1">{name}</h3>
        <p className="text-sm text-text-secondary leading-relaxed mb-4 flex-grow">
          {description}
        </p>
        <div className="flex items-center justify-between mt-auto pt-4">
          <span className="font-semibold text-cafe-dark text-lg">₹{price}</span>
        </div>
      </div>
      <div className="px-5 mt-auto">
        {quantity > 0 ? (
          <div className="w-full py-1.5 rounded-lg border border-cafe-accent bg-[#F8F5F0] flex items-center justify-between px-4 transition-all duration-300">
            <button onClick={handleDecrement} className="p-1.5 text-cafe-dark hover:text-cafe-accent hover:bg-white rounded-md transition-colors">
              <Minus size={16} strokeWidth={2.5} />
            </button>
            <span className="font-semibold text-cafe-dark w-8 text-center">{quantity}</span>
            <button onClick={handleIncrement} className="p-1.5 text-cafe-dark hover:text-cafe-accent hover:bg-white rounded-md transition-colors">
              <Plus size={16} strokeWidth={2.5} />
            </button>
          </div>
        ) : (
          <button 
            onClick={handleAddToCart}
            className="w-full py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300 bg-[#F8F5F0] text-cafe-dark hover:bg-cafe-accent hover:text-white border border-[#EBE3D5] hover:border-cafe-accent"
          >
            <ShoppingCart size={16} strokeWidth={2} /> Add to Cart
          </button>
        )}
      </div>
    </div>
  );
};

export default MenuItem;
