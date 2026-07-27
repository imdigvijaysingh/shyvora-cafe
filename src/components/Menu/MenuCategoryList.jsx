import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { ShoppingCart, Plus, Minus } from 'lucide-react';

// Green leaf icon for veg indicator
const VegIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2E7D32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block border border-green-700 rounded-sm p-[1px] ml-2">
    <circle cx="12" cy="12" r="5" fill="#2E7D32" />
  </svg>
);

const MenuItemRow = ({ name, description, price, isVeg }) => {
  const { addToCart, updateQuantity, cartItems } = useCart();
  const cartItem = cartItems.find(item => item.id === name);
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = () => {
    addToCart({ id: name, name, price: parseFloat(price.toString().replace(/,/g, '')), image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80' });
  };

  return (
    <div className="mb-6 flex justify-between items-start gap-4">
      <div className="flex-1 pr-4">
        <h4 className="font-semibold text-cafe-dark flex items-center gap-2">
          {name}
          {isVeg && <VegIcon />}
        </h4>
        <p className="text-xs text-text-secondary mt-1">{description}</p>
      </div>
      <div className="flex flex-col items-end gap-2">
        <div className="font-semibold text-cafe-dark whitespace-nowrap">₹{price}</div>
        {quantity > 0 ? (
          <div className="flex items-center gap-1 bg-[#F8F5F0] rounded-md border border-[#EBE3D5] p-0.5">
            <button onClick={() => updateQuantity(name, quantity - 1)} className="p-1 hover:text-cafe-accent transition-colors"><Minus size={14} /></button>
            <span className="text-xs font-semibold w-4 text-center">{quantity}</span>
            <button onClick={() => updateQuantity(name, quantity + 1)} className="p-1 hover:text-cafe-accent transition-colors"><Plus size={14} /></button>
          </div>
        ) : (
          <button onClick={handleAddToCart} className="text-[10px] uppercase font-bold flex items-center gap-1 text-cafe-accent hover:text-cafe-dark border border-cafe-accent hover:border-cafe-dark rounded-full px-3 py-1 transition-colors">
            <ShoppingCart size={12} /> Add
          </button>
        )}
      </div>
    </div>
  );
};

const SignatureFavourites = ({ items }) => (
  <div className="bg-[#F8F5F0] p-6 rounded-xl border border-[#EBE3D5] mt-8">
    <h3 className="font-serif text-lg text-cafe-dark uppercase tracking-widest mb-4">SIGNATURE FAVOURITES</h3>
    <div className="text-cafe-accent mb-6 flex justify-center items-center">
        <div className="h-[1px] w-full bg-cafe-accent/30 mr-2"></div>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
        <div className="h-[1px] w-full bg-cafe-accent/30 ml-2"></div>
    </div>
    
    <div>
      {items.map((item, idx) => (
        <MenuItemRow key={idx} {...item} />
      ))}
    </div>
    <Link to="/order" className="w-full bg-cafe-darker text-white py-3 text-xs font-semibold tracking-widest uppercase mt-2 hover:bg-cafe-dark transition-colors flex justify-between px-6 items-center">
      <span>EXPLORE COFFEE</span>
      <span>→</span>
    </Link>
  </div>
);

const MenuCategoryList = ({ title, items, image, reverse, signatureItems }) => {
  return (
    <section className="py-12 px-4 md:px-8 bg-cafe-bg border-b border-gray-100 last:border-0">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
           <h2 className="font-serif text-2xl text-cafe-dark uppercase tracking-widest">{title}</h2>
        </div>
        
        <div className="text-cafe-accent mb-8 flex items-center">
           <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
           <div className="h-[1px] w-32 bg-cafe-accent/30 ml-2"></div>
        </div>

        <div className={`flex flex-col gap-10 lg:gap-16 ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
          {/* List side */}
          <div className="flex-1">
            <div className="pr-0 lg:pr-8">
              {items.map((item, idx) => (
                <MenuItemRow key={idx} {...item} />
              ))}
            </div>
            {signatureItems && <SignatureFavourites items={signatureItems} />}
          </div>
          
          {/* Image Side */}
          <div className="flex-1">
            <div className="h-[400px] rounded-2xl overflow-hidden shadow-lg sticky top-24">
              <img loading="lazy" src={image} alt={title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MenuCategoryList;
