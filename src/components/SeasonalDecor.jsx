import React, { useState, useRef } from 'react';
import { useCafeData } from '../context/CafeDataContext';
import { X, Copy, Check, Sparkles } from 'lucide-react';

const SeasonalDecor = () => {
  const { settings } = useCafeData();
  const seasonal = settings?.seasonalTheme;
  const [isDismissed, setIsDismissed] = useState(false);
  const [isSantaHidden, setIsSantaHidden] = useState(false);
  const [copied, setCopied] = useState(false);

  // Smooth dragging state
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ startX: 0, startY: 0, posX: 0, posY: 0, moved: false });

  if (!seasonal || !seasonal.enabled || isDismissed) {
    return null;
  }

  // Dynamic Santa message resolver:
  // 1. Explicit santaSpeech from CMS
  // 2. Explicit discountPercentage (e.g., "10%")
  // 3. Extracted percentage from discountText (e.g. "10% off")
  // 4. Promo code
  // 5. Friendly holiday greeting
  const getSantaMessage = () => {
    if (seasonal.santaSpeech && seasonal.santaSpeech.trim()) {
      return seasonal.santaSpeech;
    }
    if (seasonal.discountPercentage && seasonal.discountPercentage.trim()) {
      return `🎅 Ho Ho Ho! ${seasonal.discountPercentage} Off!`;
    }
    const text = seasonal.discountText || '';
    const match = text.match(/(\d+%\s*off|\d+%\s*discount|\d+%\s*deal|\d+%)/i);
    if (match) {
      const formatted = match[0].replace(/\b\w/g, c => c.toUpperCase());
      return `🎅 Ho Ho Ho! ${formatted}`;
    }
    if (seasonal.discountCode) {
      return `🎅 Ho Ho Ho! Use Code: ${seasonal.discountCode}`;
    }
    return "🎅 Ho Ho Ho! Season's Greetings!";
  };

  const handleCopyCode = (e) => {
    e.stopPropagation();
    if (seasonal.discountCode) {
      try {
        navigator.clipboard?.writeText(seasonal.discountCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      } catch (_) {}
    }
  };

  // Pointer drag handlers (supports mouse, trackpad, and touch)
  const handlePointerDown = (e) => {
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      posX: position.x,
      posY: position.y,
      moved: false
    };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      dragRef.current.moved = true;
    }
    setPosition({
      x: dragRef.current.posX + dx,
      y: dragRef.current.posY + dy
    });
  };

  const handlePointerUp = (e) => {
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture?.(e.pointerId);
    } catch (_) {}
  };

  // Santa size selection based on CMS settings
  // 'xl' | 'normal' | default 'large'
  let sizeClass = 'w-40 sm:w-52 md:w-60';
  if (seasonal.santaSize === 'xl') {
    sizeClass = 'w-52 sm:w-64 md:w-72';
  } else if (seasonal.santaSize === 'normal') {
    sizeClass = 'w-32 sm:w-40 md:w-44';
  }

  return (
    <>
      {/* ========================================================= */}
      {/* 1. TOP FESTIVAL ANNOUNCEMENT RIBBON                       */}
      {/* ========================================================= */}
      <div 
        className="text-white text-xs sm:text-sm py-2.5 px-4 text-center font-medium relative z-50 flex items-center justify-center gap-2 shadow-md animate-fade-in-up"
        style={{ backgroundColor: seasonal.bannerColor || '#991b1b' }}
      >
        <span className="animate-bounce inline-block text-base">🎁</span>
        <span>
          <strong className="tracking-wide uppercase font-serif mr-1.5">{seasonal.title}</strong>
          {seasonal.discountText && (
            <span className="opacity-95 font-light">{seasonal.discountText}</span>
          )}
        </span>
        {seasonal.discountCode && (
          <button
            onClick={handleCopyCode}
            className="hidden sm:inline-flex items-center gap-1 ml-2 px-2.5 py-0.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-[11px] font-mono uppercase tracking-wider transition-colors border border-white/30 shadow-sm"
            title="Click to copy promo code"
          >
            {copied ? <Check size={12} className="text-emerald-300" /> : <Copy size={12} />}
            <span>{copied ? 'COPIED!' : seasonal.discountCode}</span>
          </button>
        )}
        <button 
          onClick={() => setIsDismissed(true)} 
          className="ml-3 p-1 rounded-full hover:bg-black/20 text-white/80 hover:text-white transition-colors"
          title="Dismiss banner"
        >
          <X size={15} />
        </button>
      </div>

      {/* ========================================================= */}
      {/* 2. PROMINENT, LARGE, DRAGGABLE SANTA CLAUS                */}
      {/* ========================================================= */}
      {seasonal.showFloatingSanta && !isSantaHidden && (
        <div 
          className="fixed bottom-6 right-5 sm:bottom-8 sm:right-8 z-40 select-none group cursor-grab active:cursor-grabbing"
          style={{ 
            touchAction: 'none',
            transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
            transition: isDragging ? 'none' : 'transform 0.15s ease-out'
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <div className="relative flex flex-col items-center">
            {/* Quick Hide Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsSantaHidden(true);
              }}
              className="absolute -top-3 -right-2 p-1 bg-gray-900/80 hover:bg-red-700 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-50 text-xs"
              title="Hide Santa"
            >
              <X size={12} />
            </button>

            {/* Speech Bubble with Arrow */}
            <div className="relative mb-2 filter drop-shadow-xl animate-bounce">
              <div className="bg-white/95 backdrop-blur-md text-cafe-dark font-serif text-xs sm:text-sm md:text-base font-extrabold px-4 py-2 rounded-2xl border-2 border-red-500 shadow-2xl flex flex-col items-center gap-1">
                <div className="flex items-center gap-1.5 text-center">
                  <Sparkles size={14} className="text-amber-500 shrink-0" />
                  <span className="text-[#1A2621] tracking-wide">{getSantaMessage()}</span>
                </div>

                {/* Optional clickable promo code pill */}
                {seasonal.discountCode && (
                  <button
                    onClick={handleCopyCode}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-50 hover:bg-red-100 text-red-700 text-[10px] sm:text-[11px] font-mono uppercase font-bold border border-red-200 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check size={11} className="text-emerald-600" />
                        <span className="text-emerald-700">Code Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={11} />
                        <span>Use Code: {seasonal.discountCode}</span>
                      </>
                    )}
                  </button>
                )}
              </div>
              {/* Speech bubble pointy arrow tail */}
              <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[9px] border-t-red-500 mx-auto -mt-[1px]"></div>
              <div className="w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[8px] border-t-white mx-auto -mt-[9px]"></div>
            </div>

            {/* Large, Beautiful, Handcrafted Festive Santa Character SVG */}
            <div className={`${sizeClass} drop-shadow-2xl transition-transform duration-300 group-hover:scale-105 pointer-events-none select-none`}>
              <svg 
                viewBox="0 0 160 170" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg" 
                className="w-full h-auto filter drop-shadow-2xl"
              >
                <defs>
                  {/* Gradients */}
                  <linearGradient id="santaSuitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#EF4444" />
                    <stop offset="60%" stopColor="#DC2626" />
                    <stop offset="100%" stopColor="#991B1B" />
                  </linearGradient>
                  
                  <linearGradient id="santaSkinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FFEDD5" />
                    <stop offset="100%" stopColor="#FDBA74" />
                  </linearGradient>

                  <linearGradient id="santaBeardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="70%" stopColor="#F8FAFC" />
                    <stop offset="100%" stopColor="#E2E8F0" />
                  </linearGradient>

                  <linearGradient id="santaCoffeeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#C2410C" />
                    <stop offset="100%" stopColor="#7C2D12" />
                  </linearGradient>

                  <linearGradient id="santaGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FDE047" />
                    <stop offset="100%" stopColor="#D97706" />
                  </linearGradient>

                  <filter id="santaShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.3"/>
                  </filter>
                </defs>

                {/* 1. Body & Cozy Red Coat */}
                <path 
                  d="M24 150 C32 110 128 110 136 150 L144 170 L16 170 Z" 
                  fill="url(#santaSuitGrad)" 
                  filter="url(#santaShadow)"
                />

                {/* White Fur Coat Trim (Chest & Hem) */}
                <path 
                  d="M74 125 L86 125 L86 170 L74 170 Z" 
                  fill="#FFFFFF" 
                  filter="url(#santaShadow)" 
                />
                <circle cx="80" cy="138" r="3.5" fill="url(#santaGoldGrad)" />
                <circle cx="80" cy="155" r="3.5" fill="url(#santaGoldGrad)" />

                {/* 2. Santa's Hands: Right Hand holding a warm Cafe Mug */}
                <g filter="url(#santaShadow)">
                  {/* Coffee Mug */}
                  <rect x="122" y="128" width="22" height="24" rx="4" fill="url(#santaCoffeeGrad)" />
                  {/* Mug Handle */}
                  <path d="M144 133 C151 133 151 143 144 143" stroke="#9A3412" strokeWidth="3" fill="none" />
                  {/* Steaming Coffee Liquid */}
                  <ellipse cx="133" cy="130" rx="9" ry="3.5" fill="#451A03" />
                  {/* Latte Art Heart in Mug */}
                  <path d="M131 130 C131 128 133 128 133 130 C133 128 135 128 135 130 C135 131.5 133 132.5 133 132.5 C133 132.5 131 131.5 131 130 Z" fill="#FEF3C7" />
                  {/* Rising Aromatic Steam Swirls */}
                  <path d="M129 124 Q131 119 129 114" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.75" />
                  <path d="M135 123 Q137 117 134 111" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
                  {/* Santa's Glove holding Mug */}
                  <circle cx="124" cy="140" r="7" fill="#15803D" />
                </g>

                {/* Left Hand: Waving Friendly with Green Winter Mitten */}
                <g filter="url(#santaShadow)">
                  <path d="M22 135 C15 128 18 116 28 120 C32 122 34 128 30 135 Z" fill="#15803D" />
                  <circle cx="28" cy="120" r="4.5" fill="#166534" />
                  {/* White Mitten Fur Cuff */}
                  <rect x="25" y="130" width="10" height="5" rx="2.5" fill="#FFFFFF" />
                </g>

                {/* 3. Santa Head & Face */}
                {/* Face Base */}
                <ellipse cx="80" cy="74" rx="30" ry="28" fill="url(#santaSkinGrad)" />

                {/* Rosy Cheeks */}
                <circle cx="62" cy="78" r="7.5" fill="#F87171" opacity="0.6" />
                <circle cx="98" cy="78" r="7.5" fill="#F87171" opacity="0.6" />

                {/* Friendly Twinkling Eyes */}
                <path d="M58 67 Q64 61 70 67" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                <path d="M90 67 Q96 61 102 67" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                {/* Cheerful Eyebrows */}
                <path d="M57 60 Q63 56 69 60" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" fill="none" />
                <path d="M91 60 Q97 56 103 60" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" fill="none" />

                {/* Button Nose */}
                <ellipse cx="80" cy="76" rx="6.5" ry="5" fill="#F87171" />

                {/* 4. Glorious Full White Beard */}
                <path 
                  d="M48 78 C42 102 52 132 80 148 C108 132 118 102 112 78 C104 86 96 88 80 88 C64 88 56 86 48 78 Z" 
                  fill="url(#santaBeardGrad)" 
                  filter="url(#santaShadow)" 
                />

                {/* Jolly Handlebar Mustache */}
                <path 
                  d="M54 84 C64 80 75 85 80 93 C85 85 96 80 106 84 C98 97 86 101 80 97 C74 101 62 97 54 84 Z" 
                  fill="#FFFFFF" 
                  filter="url(#santaShadow)" 
                />

                {/* Warm Cheerful Mouth */}
                <path d="M74 89 Q80 95 86 89" stroke="#991B1B" strokeWidth="2.5" strokeLinecap="round" fill="#991B1B" />

                {/* 5. Classic Floppy Red Santa Hat */}
                <path 
                  d="M42 54 C54 14 102 8 126 32 C138 44 144 60 144 74 C144 82 138 88 130 88 C122 88 120 74 120 64 C112 46 96 38 72 44 C56 48 46 54 42 54 Z" 
                  fill="url(#santaSuitGrad)" 
                  filter="url(#santaShadow)"
                />

                {/* Fluffy Hat Pompom */}
                <circle cx="138" cy="86" r="12" fill="#FFFFFF" filter="url(#santaShadow)" />
                <circle cx="138" cy="86" r="9" fill="#F8FAFC" />

                {/* Fluffy White Hat Brim */}
                <rect 
                  x="36" 
                  y="46" 
                  width="88" 
                  height="18" 
                  rx="9" 
                  fill="#FFFFFF" 
                  filter="url(#santaShadow)" 
                />

                {/* Festive Holly Sprig on Hat with Red Berries */}
                <path d="M64 42 C60 36 66 32 72 36 C68 41 64 42 64 42 Z" fill="#15803D" />
                <path d="M74 42 C78 36 72 32 66 36 C70 41 74 42 74 42 Z" fill="#166534" />
                <circle cx="68" cy="43" r="3.5" fill="#DC2626" />
                <circle cx="73" cy="45" r="3" fill="#EF4444" />
              </svg>
            </div>

            {/* Drag helper hint */}
            <span className="text-[10px] text-gray-500 font-sans tracking-tight mt-1 opacity-60 group-hover:opacity-100 transition-opacity">
              ✋ Drag anywhere
            </span>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. GENTLE FLOATING SNOWFLAKES                             */}
      {/* ========================================================= */}
      {seasonal.showSnowflakes && (
        <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden" aria-hidden="true">
          <div className="absolute top-2 left-[8%] text-white/60 text-sm animate-float">❄</div>
          <div className="absolute top-12 left-[25%] text-white/50 text-xs animate-float-delayed">❅</div>
          <div className="absolute top-4 left-[50%] text-white/60 text-base animate-float">❄</div>
          <div className="absolute top-16 left-[72%] text-white/50 text-sm animate-float-delayed">❅</div>
          <div className="absolute top-8 left-[90%] text-white/60 text-xs animate-float">❄</div>
        </div>
      )}
    </>
  );
};

export default SeasonalDecor;
