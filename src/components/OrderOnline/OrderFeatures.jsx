import React from 'react';
import { Coffee, ShieldCheck, Truck, Sparkles } from 'lucide-react';

const FeatureItem = ({ icon: Icon, title, description }) => (
  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4 md:border-r border-[#EBE3D5] last:border-r-0 px-2 sm:px-4 md:px-8 py-4 w-full md:w-auto text-center sm:text-left">
    <div className="text-cafe-accent shrink-0">
      <Icon size={24} strokeWidth={1.5} />
    </div>
    <div>
      <h4 className="font-semibold text-cafe-dark text-xs mb-1">{title}</h4>
      <p className="text-text-secondary text-[10px]">{description}</p>
    </div>
  </div>
);

const OrderFeatures = () => {
  return (
    <div className="bg-[#FDFBF7] border-y border-[#EBE3D5]">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:flex md:flex-row justify-center py-4">
         <FeatureItem 
           icon={Coffee} 
           title="Freshly Made" 
           description="With Quality Ingredients" 
         />
         <FeatureItem 
           icon={ShieldCheck} 
           title="Safe & Hygienic" 
           description="Handled with Care" 
         />
         <FeatureItem 
           icon={Truck} 
           title="On Time, Every Time" 
           description="Fast & Reliable Delivery" 
         />
         <FeatureItem 
           icon={Sparkles} 
           title="Made for You" 
           description="Good Food, Better Mood" 
         />
      </div>
    </div>
  );
};

export default OrderFeatures;
