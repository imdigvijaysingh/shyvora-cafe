import React, { useState, useRef, useEffect } from 'react';
import { Search, User, ShoppingBag, X, LogOut, Settings, Calendar, Heart, CreditCard, MapPin, Package, ShoppingCart, Menu } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import TopLoader from './TopLoader';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const { totalItems } = useCart();
  const { currency, toggleCurrency, changeCurrency, exchangeRate, isLiveRate } = useCurrency();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const profileRef = useRef(null);
  const profileTimeoutRef = useRef(null);

  // Close dropdown on route change
  useEffect(() => {
    setIsProfileOpen(false);
  }, [path]);

  // Click outside to close profile dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (profileTimeoutRef.current) clearTimeout(profileTimeoutRef.current);
    };
  }, []);

  const handleProfileMouseEnter = () => {
    if (profileTimeoutRef.current) clearTimeout(profileTimeoutRef.current);
    setIsProfileOpen(true);
  };

  const handleProfileMouseLeave = () => {
    if (profileTimeoutRef.current) clearTimeout(profileTimeoutRef.current);
    profileTimeoutRef.current = setTimeout(() => {
      setIsProfileOpen(false);
    }, 200);
  };

  const isActive = (route) => {
    return path === route 
      ? "text-text-primary border-b-2 border-text-primary pb-1" 
      : "hover:text-text-primary transition-colors pb-1 border-b-2 border-transparent";
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
    }
  };

  return (
    <>
      <nav className="flex justify-between items-center py-2 px-3 md:py-4 md:px-8 bg-cafe-bg sticky top-0 z-40 border-b border-cafe-bg-alt relative">
        <TopLoader />
        {/* Left Side: Hamburger & Logo */}
        <div className="flex items-center gap-3">
          <button 
            className="lg:hidden text-cafe-dark hover:text-cafe-accent transition-colors"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open navigation menu"
          >
            <Menu size={24} />
          </button>
          <Link to="/" className="flex flex-col items-center flex-shrink-0">
            <span className="font-serif text-2xl font-semibold tracking-wide whitespace-nowrap">Brew & Bloom</span>
            <span className="text-[10px] tracking-widest uppercase text-text-secondary -mt-1">Cafe</span>
          </Link>
        </div>

        {/* Nav Links - Desktop (Hidden when search is expanded on small screens) */}
        <div className={`hidden lg:flex gap-8 text-sm font-medium text-text-secondary ${isSearchOpen ? 'opacity-0 pointer-events-none absolute' : 'opacity-100'} transition-opacity`}>
          <Link to="/" className={isActive('/')}>HOME</Link>
          <Link to="/menu" className={isActive('/menu')}>MENU</Link>
          <Link to="/order" className={isActive('/order')}>ORDER ONLINE</Link>
          <Link to="/book#reservation-form" className={isActive('/book')}>BOOK A TABLE</Link>
          <Link to="/about" className={isActive('/about')}>ABOUT US</Link>
          <Link to="/gallery" className={isActive('/gallery')}>GALLERY</Link>
          <Link to="/contact" className={isActive('/contact')}>CONTACT US</Link>
        </div>

        {/* Icons & CTA */}
        <div className="flex items-center gap-3 md:gap-5 flex-shrink-0 relative">
          
          {/* Currency Toggle Button - Desktop/Tablet (Hidden on mobile to preserve navbar space; accessible via left drawer menu) */}
          <div className="hidden md:flex items-center relative">
            <button 
              onClick={toggleCurrency}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-[#EBE3D5] hover:border-cafe-accent bg-white/90 hover:bg-white text-xs font-semibold text-cafe-dark transition-all shadow-sm group cursor-pointer"
              title={`Switch Currency (Currently ${currency === 'INR' ? 'Indian Rupee' : 'US Dollar'}) • Live Rate: 1 USD ≈ ₹${exchangeRate.toFixed(1)}`}
            >
              <span className={`w-2 h-2 rounded-full ${isLiveRate ? 'bg-emerald-500 animate-pulse' : 'bg-cafe-accent'}`}></span>
              <span className="font-bold tracking-wide">{currency === 'INR' ? '₹ INR' : '$ USD'}</span>
              <span className="text-[10px] text-text-secondary group-hover:text-cafe-accent font-medium transition-colors">
                {currency === 'INR' ? '⇄ $' : '⇄ ₹'}
              </span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex items-center relative">
            {isSearchOpen ? (
              <form onSubmit={handleSearchSubmit} className="flex items-center">
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search for coffee, food..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    className="w-[200px] sm:w-[300px] pl-10 pr-10 py-2 rounded-full border border-[#EBE3D5] bg-white text-sm focus:outline-none focus:border-cafe-accent"
                  />
                  <button type="button" onClick={() => setIsSearchOpen(false)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-cafe-dark">
                    <X size={16} />
                  </button>
                </div>
              </form>
            ) : (
              <button onClick={() => setIsSearchOpen(true)} className="text-text-primary hover:text-cafe-accent transition-colors">
                <Search size={20} strokeWidth={1.5} />
              </button>
            )}
          </div>

          {/* Profile Dropdown */}
          <div 
            ref={profileRef}
            className="relative" 
            onMouseEnter={handleProfileMouseEnter}
            onMouseLeave={handleProfileMouseLeave}
          >
            <button 
              onClick={() => {
                if (window.innerWidth < 1024) {
                  navigate('/profile/settings');
                } else {
                  setIsProfileOpen((prev) => !prev);
                }
              }} 
              className={`text-text-primary hover:text-cafe-accent transition-colors flex items-center gap-1 border border-[#EBE3D5] rounded-full p-2 hover:bg-white ${isProfileOpen ? 'bg-white text-cafe-accent shadow-sm' : ''}`}
              aria-label="User Account Menu"
              aria-expanded={isProfileOpen}
            >
              <User size={20} strokeWidth={1.5} />
              <svg 
                width="12" 
                height="12" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className={`hidden lg:block transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`}
              >
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </button>
            
            {/* Dropdown Menu (pt-2 seamlessly connects trigger with dropdown, eliminating the cursor exit gap) */}
            <div 
              className={`absolute top-full right-0 pt-2 w-64 hidden lg:block transition-all duration-200 origin-top-right z-50 before:absolute before:inset-x-0 before:top-0 before:h-2 before:content-[''] ${
                isProfileOpen ? 'opacity-100 scale-100 visible pointer-events-auto' : 'opacity-0 scale-95 invisible pointer-events-none'
              }`}
            >
              <div className="bg-white rounded-xl shadow-xl border border-[#EBE3D5] overflow-hidden">
                <div className="p-4 border-b border-[#EBE3D5] bg-[#F8F5F0]">
                  <h4 className="font-semibold text-cafe-dark text-sm">Hi, Digvijay</h4>
                  <p className="text-xs text-text-secondary">digvijay@example.com</p>
                </div>
                <div className="py-2">
                  <Link 
                    to="/profile/orders" 
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-[#F8F5F0] hover:text-cafe-accent transition-colors"
                  >
                    <Package size={16} /> My Orders
                  </Link>
                  <Link 
                    to="/profile/reservations" 
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-[#F8F5F0] hover:text-cafe-accent transition-colors"
                  >
                    <Calendar size={16} /> My Reservations
                  </Link>
                  <Link 
                    to="/profile/addresses" 
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-[#F8F5F0] hover:text-cafe-accent transition-colors"
                  >
                    <MapPin size={16} /> Saved Addresses
                  </Link>
                  <Link 
                    to="/profile/payments" 
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-[#F8F5F0] hover:text-cafe-accent transition-colors"
                  >
                    <CreditCard size={16} /> Payment Methods
                  </Link>
                  <Link 
                    to="/profile/wishlist" 
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-[#F8F5F0] hover:text-cafe-accent transition-colors"
                  >
                    <Heart size={16} /> Wishlist
                  </Link>
                </div>
                <div className="py-2 border-t border-[#EBE3D5]">
                  <Link 
                    to="/profile/settings" 
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-[#F8F5F0] hover:text-cafe-accent transition-colors"
                  >
                    <Settings size={16} /> Account Settings
                  </Link>
                  <button 
                    onClick={() => { setIsLoginModalOpen(true); setIsProfileOpen(false); }} 
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-[#F8F5F0] transition-colors"
                  >
                    <LogOut size={16} /> Log Out
                  </button>
                </div>
              </div>
            </div>
          </div>

          <Link to="/checkout" className="relative cursor-pointer group">
            <ShoppingBag size={20} strokeWidth={1.5} className="text-text-primary group-hover:text-cafe-accent transition-colors" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-cafe-dark text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold group-hover:bg-cafe-accent transition-colors">
                {totalItems}
              </span>
            )}
          </Link>

          <Link to="/book#reservation-form" className="hidden sm:block bg-cafe-darker text-white px-5 py-2.5 text-xs font-semibold tracking-widest uppercase hover:bg-cafe-dark transition-colors">
            BOOK A TABLE
          </Link>
        </div>
      </nav>

      {/* Login / Logout Modal Overlay */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsLoginModalOpen(false)}></div>
          <div className="relative bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl animate-in fade-in zoom-in duration-200">
            <button onClick={() => setIsLoginModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-cafe-dark">
              <X size={20} />
            </button>
            <div className="text-center mb-6">
              <h2 className="font-serif text-2xl text-cafe-dark mb-2">See you soon!</h2>
              <p className="text-sm text-text-secondary">Are you sure you want to log out?</p>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setIsLoginModalOpen(false)} className="flex-1 py-3 border border-[#EBE3D5] rounded-sm text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={() => setIsLoginModalOpen(false)} className="flex-1 py-3 bg-red-600 rounded-sm text-sm font-semibold text-white hover:bg-red-700">Log Out</button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          
          {/* Sidebar Drawer */}
          <div className="relative w-[75%] max-w-sm bg-cafe-bg h-full shadow-2xl flex flex-col animate-slide-in-left">
            <div className="p-4 py-5 border-b border-[#EBE3D5] flex justify-between items-center bg-white">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex flex-col flex-shrink-0">
                <span className="font-serif text-xl font-semibold tracking-wide text-cafe-dark">Brew & Bloom</span>
              </Link>
              <button 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="text-gray-400 hover:text-cafe-dark"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex flex-col py-2 px-6 overflow-y-auto">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className={`py-4 border-b border-[#EBE3D5] text-sm font-semibold tracking-wide ${path === '/' ? 'text-cafe-dark' : 'text-gray-500'}`}>HOME</Link>
              <Link to="/menu" onClick={() => setIsMobileMenuOpen(false)} className={`py-4 border-b border-[#EBE3D5] text-sm font-semibold tracking-wide ${path === '/menu' ? 'text-cafe-dark' : 'text-gray-500'}`}>MENU</Link>
              <Link to="/order" onClick={() => setIsMobileMenuOpen(false)} className={`py-4 border-b border-[#EBE3D5] text-sm font-semibold tracking-wide ${path === '/order' ? 'text-cafe-dark' : 'text-gray-500'}`}>ORDER ONLINE</Link>
              <Link to="/book#reservation-form" onClick={() => setIsMobileMenuOpen(false)} className={`py-4 border-b border-[#EBE3D5] text-sm font-semibold tracking-wide ${path === '/book' ? 'text-cafe-dark' : 'text-gray-500'}`}>BOOK A TABLE</Link>
              <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className={`py-4 border-b border-[#EBE3D5] text-sm font-semibold tracking-wide ${path === '/about' ? 'text-cafe-dark' : 'text-gray-500'}`}>ABOUT US</Link>
              <Link to="/gallery" onClick={() => setIsMobileMenuOpen(false)} className={`py-4 border-b border-[#EBE3D5] text-sm font-semibold tracking-wide ${path === '/gallery' ? 'text-cafe-dark' : 'text-gray-500'}`}>GALLERY</Link>
              <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className={`py-4 border-b border-[#EBE3D5] text-sm font-semibold tracking-wide ${path === '/contact' ? 'text-cafe-dark' : 'text-gray-500'}`}>CONTACT US</Link>
              
              {/* Mobile Currency Selection */}
              <div className="py-4 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-cafe-dark uppercase tracking-wider block">Currency</span>
                  <span className="text-[10px] text-text-secondary">Rate: 1 USD ≈ ₹{exchangeRate.toFixed(1)}</span>
                </div>
                <div className="flex bg-white p-1 rounded-full border border-[#EBE3D5]">
                  <button
                    onClick={() => changeCurrency('INR')}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${currency === 'INR' ? 'bg-cafe-dark text-white shadow-sm' : 'text-text-secondary hover:text-cafe-dark'}`}
                  >
                    ₹ INR
                  </button>
                  <button
                    onClick={() => changeCurrency('USD')}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${currency === 'USD' ? 'bg-cafe-dark text-white shadow-sm' : 'text-text-secondary hover:text-cafe-dark'}`}
                  >
                    $ USD
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mt-auto p-6 bg-[#F8F5F0] border-t border-[#EBE3D5]">
               <div className="flex items-center gap-3 mb-4">
                 <div className="w-10 h-10 bg-cafe-dark text-white rounded-full flex items-center justify-center font-serif text-lg shrink-0">D</div>
                 <div className="flex-1 flex items-center justify-between">
                   <h4 className="font-semibold text-cafe-dark text-sm truncate pr-2">Digvijay</h4>
                   <Link to="/profile/orders" onClick={() => setIsMobileMenuOpen(false)} className="inline-block px-3 py-1 bg-white border border-[#EBE3D5] text-cafe-dark rounded-md shadow-sm text-[10px] uppercase font-semibold tracking-wider hover:bg-cafe-accent hover:border-cafe-accent hover:text-white transition-colors shrink-0">View Profile</Link>
                 </div>
               </div>
               <button onClick={() => { setIsLoginModalOpen(true); setIsMobileMenuOpen(false); }} className="w-full py-3 bg-white border border-[#EBE3D5] text-sm font-semibold text-cafe-dark rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50">
                 <LogOut size={16} /> Log Out
               </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
