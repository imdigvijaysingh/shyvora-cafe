import { Link } from 'react-router-dom';
import MenuItem from './MenuItem';
import { ArrowRight } from 'lucide-react';

import cappuccino from '../assets/images/menu_cappuccino_1784782504483.png';
import toast from '../assets/images/menu_toast_1784782514646.png';
import cheesecake from '../assets/images/menu_cheesecake_1784782526474.png';
import icedLatte from '../assets/images/menu_iced_latte_1784782557336.png';

const MenuSection = () => {
  const menuItems = [
    {
      id: 1,
      name: "Cappuccino",
      description: "Rich espresso with steamed milk foam",
      price: "199",
      image: cappuccino
    },
    {
      id: 2,
      name: "Avocado Toast",
      description: "Fresh avocado, herbs & sourdough",
      price: "249",
      image: toast
    },
    {
      id: 3,
      name: "Classic Cheesecake",
      description: "Creamy, rich & perfectly sweet",
      price: "239",
      image: cheesecake
    },
    {
      id: 4,
      name: "Iced Caramel Latte",
      description: "Smooth espresso with caramel over ice",
      price: "219",
      image: icedLatte
    }
  ];

  return (
    <section className="py-20 px-4 md:px-8 bg-cafe-bg">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <p className="text-cafe-accent font-semibold tracking-widest text-sm mb-2 uppercase">EXPLORE OUR MENU</p>
            <h2 className="font-serif text-3xl md:text-4xl text-cafe-dark">Crafted with love, served with passion.</h2>
          </div>
          <Link to="/order" className="flex items-center gap-2 text-sm font-semibold tracking-wider text-cafe-dark hover:text-cafe-accent transition-colors pb-1 border-b border-transparent hover:border-cafe-accent w-fit">
            VIEW FULL MENU <ArrowRight size={16} />
          </Link>
        </div>

        <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-4 md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-visible no-scrollbar">
          {menuItems.map(item => (
            <div key={item.id} className="min-w-[280px] sm:min-w-[320px] shrink-0 snap-start md:min-w-0 md:shrink-1">
              <MenuItem {...item} />
            </div>
          ))}
        </div>
        
        {/* Simple pagination dots indicator for visual completeness matching design */}
        <div className="flex justify-center gap-2 mt-10">
          <div className="w-2 h-2 rounded-full bg-cafe-accent"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
        </div>
      </div>
    </section>
  );
};

export default MenuSection;
