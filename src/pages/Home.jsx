import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import SplitCta from '../components/SplitCta';
import InstagramFeed from '../components/InstagramFeed';
import MenuSection from '../components/MenuSection';

const Home = () => {
  return (
    <>
      <Hero />
      <MenuSection />
      <Features />
      <SplitCta />
      <InstagramFeed />
    </>
  );
};

export default Home;
