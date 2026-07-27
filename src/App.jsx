import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import TopBar from './components/TopBar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Menu from './pages/Menu';
import OrderOnline from './pages/OrderOnline';
import BookTable from './pages/BookTable';
import Gallery from './pages/Gallery';
import Search from './pages/Search';
import Contact from './pages/Contact';
import ProfileLayout from './components/Profile/ProfileLayout';
import MyOrders from './pages/Profile/MyOrders';
import MyReservations from './pages/Profile/MyReservations';
import SavedAddresses from './pages/Profile/SavedAddresses';
import PaymentMethods from './pages/Profile/PaymentMethods';
import Wishlist from './pages/Profile/Wishlist';
import AccountSettings from './pages/Profile/AccountSettings';
import { CartProvider } from './context/CartContext';
import CartOverlay from './components/CartOverlay';
import Checkout from './pages/Checkout';

function App() {
  return (
    <CartProvider>
      <Router>
      <ScrollToTop />
      <div className="font-sans antialiased text-text-primary bg-cafe-bg min-h-screen flex flex-col">
        <TopBar />
        <Navbar />
        <main className="flex-grow">
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
            <Route path="/profile" element={<ProfileLayout />}>
              <Route path="orders" element={<MyOrders />} />
              <Route path="reservations" element={<MyReservations />} />
              <Route path="addresses" element={<SavedAddresses />} />
              <Route path="payments" element={<PaymentMethods />} />
              <Route path="wishlist" element={<Wishlist />} />
              <Route path="settings" element={<AccountSettings />} />
            </Route>
          </Routes>
        </main>
        <CartOverlay />
        <Footer />
      </div>
    </Router>
    </CartProvider>
  );
}

export default App;