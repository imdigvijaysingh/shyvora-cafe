import React, { useState } from 'react';
import { Camera, X } from 'lucide-react';
import { useCafeData } from '../context/CafeDataContext';

import interiorImg from '../assets/images/gallery_interior_1784916424533.webp';
import cashierImg from '../assets/images/gallery_cashier_1784916437080.webp';
import kitchenImg from '../assets/images/gallery_kitchen_1784916448766.webp';
import customersImg from '../assets/images/gallery_customers_1784916459404.webp';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const { galleryPhotos } = useCafeData();

  const openLightbox = (img) => {
    setSelectedImage(img);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  return (
    <div className="bg-cafe-bg min-h-screen pb-10 sm:pb-14 animate-fade-in-up">
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center bg-cafe-darker overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
          <img 
            src={interiorImg} 
            alt="Cafe Interior" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-cafe-darker/80 to-cafe-darker/60 z-10"></div>
        <div className="relative z-20 text-center px-4">
          <p className="text-cafe-accent font-semibold tracking-widest text-[10px] mb-4 uppercase">STEP INSIDE</p>
          <h1 className="font-serif text-[clamp(1.5rem,6vw,3rem)] text-white mb-4 whitespace-nowrap">Our Ambiance</h1>
          <p className="text-[#EFE9DF] max-w-lg mx-auto text-sm">Experience the cozy, welcoming atmosphere of Brew & Bloom before you even arrive.</p>
        </div>
      </section>

      {/* Gallery Grid Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-8 sm:py-10 md:py-12">
        <div className="text-center mb-6 sm:mb-8">
           <h2 className="font-serif text-[clamp(1.2rem,5.2vw,2.25rem)] text-cafe-dark mb-4 whitespace-nowrap">The Brew & Bloom Experience</h2>
           <div className="flex items-center justify-center gap-4 text-cafe-accent mb-6">
             <div className="h-[1px] w-12 bg-cafe-accent/30"></div>
             <Camera size={20} />
             <div className="h-[1px] w-12 bg-cafe-accent/30"></div>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
          {/* Main Interior - Large */}
          <div 
            onClick={() => openLightbox(interiorImg)}
            className="lg:col-span-8 group rounded-2xl overflow-hidden relative h-[400px] shadow-sm cursor-pointer"
          >
            <img 
              src={interiorImg} 
              alt="Warm aesthetic cafe interior" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
            <div className="absolute bottom-6 left-6 right-6 text-white text-shadow-sm">
              <h3 className="font-serif text-2xl font-semibold mb-1">Cozy Seating Areas</h3>
              <p className="text-sm text-white/90 font-light">Perfect for catching up with friends or getting some deep work done.</p>
            </div>
          </div>

          {/* Kitchen - Tall */}
          <div 
            onClick={() => openLightbox(kitchenImg)}
            className="lg:col-span-4 group rounded-2xl overflow-hidden relative h-[400px] shadow-sm cursor-pointer"
          >
            <img 
              src={kitchenImg} 
              alt="Modern cafe kitchen" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
            <div className="absolute bottom-6 left-6 right-6 text-white text-shadow-sm">
              <h3 className="font-serif text-2xl font-semibold mb-1">Our Kitchen</h3>
              <p className="text-sm text-white/90 font-light">Where the magic happens.</p>
            </div>
          </div>

          {/* Cashier - Medium */}
          <div 
            onClick={() => openLightbox(cashierImg)}
            className="lg:col-span-6 group rounded-2xl overflow-hidden relative h-[350px] shadow-sm cursor-pointer"
          >
            <img 
              src={cashierImg} 
              alt="Modern cafe cashier" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
            <div className="absolute bottom-6 left-6 right-6 text-white text-shadow-sm">
              <h3 className="font-serif text-2xl font-semibold mb-1">The Coffee Bar</h3>
              <p className="text-sm text-white/90 font-light">Freshly baked pastries and expertly crafted espresso.</p>
            </div>
          </div>

          {/* Customers - Medium */}
          <div 
            onClick={() => openLightbox(customersImg)}
            className="lg:col-span-6 group rounded-2xl overflow-hidden relative h-[350px] shadow-sm cursor-pointer"
          >
            <img 
              src={customersImg} 
              alt="Happy customers enjoying food" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
            <div className="absolute bottom-6 left-6 right-6 text-white text-shadow-sm">
              <h3 className="font-serif text-2xl font-semibold mb-1">Good Vibes Only</h3>
              <p className="text-sm text-white/90 font-light">A lively atmosphere filled with laughter and great conversations.</p>
            </div>
          </div>

          {/* Dynamic photos added by owner via Admin CMS */}
          {galleryPhotos.map((photo) => (
            <div 
              key={photo.id}
              onClick={() => openLightbox(photo.imageUrl)}
              className="lg:col-span-4 group rounded-2xl overflow-hidden relative h-[350px] shadow-sm cursor-pointer"
            >
              <img 
                src={photo.imageUrl} 
                alt={photo.title || 'Cafe Moment'} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                onError={(e) => { e.target.src = interiorImg; }}
              />
              <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors"></div>
              <div className="absolute bottom-6 left-6 right-6 text-white text-shadow-sm">
                <h3 className="font-serif text-xl font-semibold mb-1">{photo.title}</h3>
                <p className="text-xs text-white/90 font-light">{photo.category || 'Special Moment'}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in"
          onClick={closeLightbox}
        >
          <button 
            className="absolute top-4 right-4 md:top-8 md:right-8 text-white/70 hover:text-white transition-colors"
            onClick={closeLightbox}
          >
            <X size={32} />
          </button>
          <img 
            src={selectedImage} 
            alt="Gallery Fullscreen" 
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}
    </div>
  );
};

export default Gallery;
