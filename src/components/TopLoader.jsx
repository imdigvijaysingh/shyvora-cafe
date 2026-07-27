import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const TopLoader = () => {
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show the loader on route change
    setVisible(true);
    setProgress(0);

    // Initial jump to simulate fast start
    let timer1 = setTimeout(() => setProgress(30), 50);
    // Smooth progress while "loading"
    let timer2 = setTimeout(() => setProgress(60), 200);
    let timer3 = setTimeout(() => setProgress(80), 400);

    // Guarantee it takes at least 0.5s to finish, to feel like a real transition
    // and give that premium "LED train" effect
    let timer4 = setTimeout(() => {
      setProgress(100);
      
      // After reaching 100%, wait a tiny bit then hide
      setTimeout(() => {
        setVisible(false);
        // Reset progress in the background so it's ready for next time
        setTimeout(() => setProgress(0), 300);
      }, 300);
    }, 500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [location.pathname]); // Re-run whenever the route changes

  if (!visible) return null;

  return (
    <div className="absolute bottom-0 left-0 w-full h-[2px] z-[100] pointer-events-none overflow-hidden bg-transparent">
      {/* LED shiny train-like structure */}
      <div 
        className="h-full bg-cafe-accent relative shadow-[0_0_10px_#C29B70,0_0_5px_#C29B70] transition-all ease-out duration-300"
        style={{ width: `${progress}%` }}
      >
        {/* Shiny tip at the end of the line */}
        <div className="absolute right-0 top-0 h-full w-[20px] bg-white opacity-80 blur-[2px] shadow-[0_0_10px_#fff]"></div>
      </div>
    </div>
  );
};

export default TopLoader;
