import React from 'react';
import OrderItemCard from '../../components/OrderOnline/OrderItemCard';
import coffeeImg from '../../assets/images/menu_cappuccino_1784782504483.png';
import dessertImg from '../../assets/images/menu_cheesecake_1784782526474.png';

const Wishlist = () => {
  const wishlistItems = [
    {
      image: coffeeImg,
      title: "Cappuccino",
      description: "Rich espresso with steamed milk foam.",
      price: 199
    },
    {
      image: dessertImg,
      title: "Classic Cheesecake",
      description: "Creamy, rich & perfectly sweet.",
      price: 239
    }
  ];

  return (
    <div>
      <h2 className="font-serif text-2xl text-cafe-dark mb-6">Wishlist</h2>
      
      {wishlistItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item, idx) => (
            <OrderItemCard key={idx} {...item} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm py-10 text-center border border-dashed border-gray-200 rounded-xl">
          Your wishlist is empty.
        </p>
      )}
    </div>
  );
};

export default Wishlist;
