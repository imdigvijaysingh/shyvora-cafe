import { Link } from 'react-router-dom';
import MenuItem from './MenuItem';
import { ArrowRight } from 'lucide-react';
import { useCafeData } from '../context/CafeDataContext';

const MenuSection = () => {
  const { menuItems } = useCafeData();

  // Pick featured items or top 4
  const featured = menuItems.filter(item => item.isFeatured);
  const displayItems = featured.length >= 3 ? featured.slice(0, 4) : menuItems.slice(0, 4);

  return (
    <section className="py-6 sm:py-10 md:py-14 px-4 md:px-8 bg-cafe-bg">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-4 sm:mb-6 md:mb-8 gap-3 md:gap-4">
          <div>
            <p className="text-cafe-accent font-semibold tracking-widest text-xs sm:text-sm mb-1 sm:mb-2 uppercase">EXPLORE OUR MENU</p>
            <h2 className="font-serif text-[clamp(1.1rem,4.8vw,2.25rem)] text-cafe-dark whitespace-nowrap">Crafted with love, served with passion.</h2>
          </div>
          <Link to="/menu" className="flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-wider text-cafe-dark hover:text-cafe-accent transition-colors pb-1 border-b border-transparent hover:border-cafe-accent w-fit">
            VIEW FULL MENU <ArrowRight size={16} />
          </Link>
        </div>

        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 sm:gap-6 pb-2 md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-visible no-scrollbar">
          {displayItems.map(item => (
            <div key={item.id} className="min-w-[280px] sm:min-w-[320px] shrink-0 snap-start md:min-w-0 md:shrink-1">
              <MenuItem 
                name={item.name}
                description={item.description}
                price={item.price}
                image={item.image}
              />
            </div>
          ))}
        </div>
        
        {/* Simple pagination dots indicator for visual completeness matching design */}
        <div className="flex justify-center gap-2 mt-4 sm:mt-6">
          <div className="w-2 h-2 rounded-full bg-cafe-accent"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
        </div>
      </div>
    </section>
  );
};

export default MenuSection;
