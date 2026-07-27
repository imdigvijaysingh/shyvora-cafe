import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Package, Calendar, MapPin, CreditCard, Heart, Settings, LogOut } from 'lucide-react';

const ProfileLayout = () => {
  const navItems = [
    { name: 'My Orders', path: '/profile/orders', icon: Package },
    { name: 'My Reservations', path: '/profile/reservations', icon: Calendar },
    { name: 'Saved Addresses', path: '/profile/addresses', icon: MapPin },
    { name: 'Payment Methods', path: '/profile/payments', icon: CreditCard },
    { name: 'Wishlist', path: '/profile/wishlist', icon: Heart },
    { name: 'Account Settings', path: '/profile/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 items-start">
        
        {/* Sidebar */}
        <aside className="w-full md:w-72 bg-white rounded-2xl border border-[#EBE3D5] overflow-hidden shadow-sm flex-shrink-0">
          <div className="p-6 border-b border-[#EBE3D5] bg-[#F8F5F0] text-center">
             <div className="w-20 h-20 bg-cafe-dark text-white rounded-full flex items-center justify-center text-3xl font-serif mx-auto mb-4">
                D
             </div>
             <h3 className="font-serif text-lg text-cafe-dark">Digvijay Pundir</h3>
             <p className="text-xs text-text-secondary">digvijay@example.com</p>
          </div>
          
          <nav className="py-2">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors border-l-4 ${
                    isActive
                      ? 'border-cafe-accent bg-[#F8F5F0] text-cafe-accent'
                      : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-cafe-dark'
                  }`
                }
              >
                <item.icon size={18} strokeWidth={1.5} />
                {item.name}
              </NavLink>
            ))}
          </nav>
          
          <div className="p-4 border-t border-[#EBE3D5]">
             <button className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors">
               <LogOut size={16} /> Log Out
             </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 w-full bg-white rounded-2xl border border-[#EBE3D5] shadow-sm p-6 md:p-8 min-h-[500px]">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default ProfileLayout;
