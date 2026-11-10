import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import TopBar from './components/TopBar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import { CartProvider } from './context/CartContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { CafeDataProvider } from './context/CafeDataContext';
import SeasonalDecor from './components/SeasonalDecor';
import CartOverlay from './components/CartOverlay';

// Lazy load secondary routes so initial page payload remains minimal
const About = lazy(() => import('./pages/About'));
const Menu = lazy(() => import('./pages/Menu'));
const OrderOnline = lazy(() => import('./pages/OrderOnline'));
const BookTable = lazy(() => import('./pages/BookTable'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Search = lazy(() => import('./pages/Search'));
const Contact = lazy(() => import('./pages/Contact'));
const Checkout = lazy(() => import('./pages/Checkout'));
const AdminPortal = lazy(() => import('./pages/Admin/AdminPortal'));
const ProfileLayout = lazy(() => import('./components/Profile/ProfileLayout'));
const MyOrders = lazy(() => import('./pages/Profile/MyOrders'));
const MyReservations = lazy(() => import('./pages/Profile/MyReservations'));
const SavedAddresses = lazy(() => import('./pages/Profile/SavedAddresses'));
const PaymentMethods = lazy(() => import('./pages/Profile/PaymentMethods'));
const Wishlist = lazy(() => import('./pages/Profile/Wishlist'));
const AccountSettings = lazy(() => import('./pages/Profile/AccountSettings'));

const AppContent = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/index-admin');

  // Passive background heartbeat to keep cloud server warm while tab is active
  useEffect(() => {
    const HEARTBEAT_INTERVAL = 4 * 60 * 1000;
    const interval = setInterval(() => {
      fetch('/api/health').catch(() => {});
    }, HEARTBEAT_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="font-sans antialiased text-text-primary bg-cafe-bg min-h-screen flex flex-col">
      {/* On-demand seasonal decoration ribbon & floating Santa */}
      {!isAdmin && <SeasonalDecor />}
      {!isAdmin && <TopBar />}
      {!isAdmin && <Navbar />}

      <main className="flex-grow">
        <Suspense fallback={
          <div className="min-h-[50vh] flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-cafe-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
        }>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/order" element={<OrderOnline />} />
            <Route path="/book" element={<BookTable />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/search" element={<Search />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/contact" element={<Contact />} />
            {/* Protected Owner Admin Portal - Accessible only via direct URL /index-admin */}
            <Route path="/index-admin" element={<AdminPortal />} />
            <Route path="/profile" element={<ProfileLayout />}>
              <Route path="orders" element={<MyOrders />} />
              <Route path="reservations" element={<MyReservations />} />
              <Route path="addresses" element={<SavedAddresses />} />
              <Route path="payments" element={<PaymentMethods />} />
              <Route path="wishlist" element={<Wishlist />} />
              <Route path="settings" element={<AccountSettings />} />
            </Route>
          </Routes>
        </Suspense>
      </main>

      {!isAdmin && <CartOverlay />}
      {!isAdmin && <Footer />}
    </div>
  );
};

function App() {
  return (
    <CurrencyProvider>
      <CafeDataProvider>
        <CartProvider>
          <Router>
            <ScrollToTop />
            <AppContent />
          </Router>
        </CartProvider>
      </CafeDataProvider>
    </CurrencyProvider>
  );
}

export default App;
