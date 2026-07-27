import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import BookHero from '../components/BookTable/BookHero';
import ReservationForm from '../components/BookTable/ReservationForm';
import WhyBookSidebar from '../components/BookTable/WhyBookSidebar';
import PreferredArea from '../components/BookTable/PreferredArea';
import HelpReservation from '../components/BookTable/HelpReservation';

const BookTable = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash === '#reservation-form') {
      setTimeout(() => {
        const element = document.getElementById('reservation-form');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [hash]);

  return (
    <>
      <BookHero />
      
      <section className="py-16 md:py-24 px-4 md:px-8 bg-cafe-bg relative">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24">
          <ReservationForm />
          <WhyBookSidebar />
        </div>
      </section>

      <PreferredArea />
      <HelpReservation />
    </>
  );
};

export default BookTable;
