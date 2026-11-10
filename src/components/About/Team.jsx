import React from 'react';

import arjunImg from '../../assets/images/team_arjun.webp';
import meeraImg from '../../assets/images/team_meera.webp';
import karanImg from '../../assets/images/team_karan.webp';
// Reusing Meera's image for Riya since generation quota was exhausted
import riyaImg from '../../assets/images/team_meera.webp'; 

const InstagramIcon = ({ size, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);

const LinkedinIcon = ({ size, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
);

const TeamMember = ({ name, role, description, image }) => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col group text-center pb-6">
    <div className="h-64 overflow-hidden relative mb-5">
      <img loading="lazy" 
        src={image} 
        alt={name} 
        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
      />
    </div>
    <div className="px-6 flex flex-col items-center">
      <h3 className="font-serif text-xl font-semibold text-cafe-dark mb-1">{name}</h3>
      <p className="text-[10px] text-cafe-accent font-semibold tracking-widest uppercase mb-3">{role}</p>
      <p className="text-xs text-text-secondary leading-relaxed mb-5 max-w-[200px]">
        {description}
      </p>
      <div className="flex items-center gap-3 mt-auto">
        <a href="#" className="border border-gray-200 p-1.5 rounded-full cursor-pointer hover:bg-cafe-accent hover:border-cafe-accent hover:text-white transition-colors text-gray-500">
           <InstagramIcon size={14} />
        </a>
        <a href="#" className="border border-gray-200 p-1.5 rounded-full cursor-pointer hover:bg-cafe-accent hover:border-cafe-accent hover:text-white transition-colors text-gray-500">
           <LinkedinIcon size={14} />
        </a>
      </div>
    </div>
  </div>
);

const Team = () => {
  const members = [
    {
      name: "Arjun Mehra",
      role: "Founder & Barista",
      description: "Coffee enthusiast with a passion for perfect brews.",
      image: arjunImg
    },
    {
      name: "Meera Sharma",
      role: "Head Chef",
      description: "Creates delicious memories one plate at a time.",
      image: meeraImg
    },
    {
      name: "Karan Verma",
      role: "Operations Manager",
      description: "Ensures every visit is smooth and special.",
      image: karanImg
    },
    {
      name: "Riya Malhotra",
      role: "Guest Experience Lead",
      description: "Here to make you feel at home, always.",
      image: riyaImg
    }
  ];

  return (
    <section className="py-8 sm:py-12 md:py-16 px-4 md:px-8 bg-[#FDFBF7]">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <p className="text-cafe-accent font-semibold tracking-widest text-xs mb-2 uppercase text-center">MEET OUR HEART</p>
        <h2 className="font-serif text-[clamp(1.15rem,5.2vw,2.25rem)] text-cafe-dark mb-3 text-center whitespace-nowrap">The People Behind the Brews</h2>
        
        <div className="text-cafe-accent mb-6 md:mb-10 flex justify-center items-center">
           <div className="h-[1px] w-12 bg-cafe-accent/30 mr-4"></div>
           <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
           <div className="h-[1px] w-12 bg-cafe-accent/30 ml-4"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {members.map((member, idx) => (
            <TeamMember key={idx} {...member} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
