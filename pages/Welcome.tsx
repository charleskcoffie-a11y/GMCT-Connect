
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, HeartHandshake, Church } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const { logoUrl } = useSettings();
  const [imageError, setImageError] = useState(false);

  return (
    <div className="h-[100dvh] w-full bg-transparent flex flex-col relative overflow-hidden">
      {/* Decorative Background Elements */}
      {/* Primary Blue Glow - Top Right */}
      <div className="absolute top-[-15%] right-[-15%] w-[90vw] h-[90vw] bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Middle Section Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] bg-brand-600/5 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-blue-400/10 rounded-full blur-[60px] pointer-events-none" />

      {/* Secondary Glow - Bottom Left */}
      <div className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-brand-200/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Content Container */}
      <div className="flex-1 flex flex-col px-3 sm:px-6 py-safe z-10 max-w-md mx-auto w-full h-full justify-between">
        
        {/* Header Section (Top) - Identity Emphasis */}
        <div className="mt-4 sm:mt-8 md:mt-12 text-center animate-in fade-in slide-in-from-top-4 duration-1000 flex-shrink-0 space-y-2 sm:space-y-3 md:space-y-4 px-2">
           <h1 className="text-[8px] xs:text-[10px] sm:text-xs font-semibold text-blue-200 tracking-wide uppercase opacity-90 line-clamp-2 leading-normal break-words">
             Ghana Methodist Church – Toronto
           </h1>
           <div className="space-y-1 sm:space-y-2">
             <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight drop-shadow-md leading-snug">
               Welcome Home
             </h2>
             <p className="text-sm xs:text-base sm:text-lg text-blue-100/90 font-medium leading-relaxed">
               We’re glad you’re here.
             </p>
           </div>
        </div>

        {/* Visual Focus (Center) */}
        <div className="flex-1 flex flex-col justify-center items-center gap-2 sm:gap-4 min-h-0 py-2 sm:py-3">
           {/* Logo Container */}
           <div className="w-32 h-32 sm:w-48 sm:h-48 lg:w-52 lg:h-52 bg-white dark:bg-slate-800 rounded-full shadow-2xl shadow-black/30 flex items-center justify-center relative p-4 sm:p-8 border border-white/20 ring-4 ring-white/5 animate-in fade-in zoom-in-90 duration-1000 delay-200 flex-shrink-0">
              {logoUrl && !imageError ? (
                <img 
                  src={logoUrl}
                  alt="GMCT Logo" 
                  className="w-full h-full object-contain rounded-full"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-brand-600 dark:text-brand-400">
                   <Church className="w-16 h-16 sm:w-24 sm:h-24 mb-1 sm:mb-2 opacity-20" />
                   <span className="text-xs sm:text-sm font-bold tracking-widest uppercase opacity-40">GMCT</span>
                </div>
              )}
           </div>
           
           {/* Mission Statement - Warm Gold/Cream Accent */}
           <div className="text-center px-2 sm:px-4 animate-in fade-in slide-in-from-bottom-2 duration-1000 delay-300 w-full flex justify-center">
             <div className="bg-[#FFFDF5] border border-amber-100 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-5 shadow-xl shadow-black/20 max-w-xs relative overflow-hidden">
               {/* Subtle top gold accent line */}
               <div className="absolute top-0 left-0 w-full h-1 bg-amber-400/50"></div>
               
               <p className="text-brand-900 text-sm sm:text-lg font-serif italic leading-relaxed font-medium">
                 "Walking in the Word: Equipped for Every Good Work."
               </p>
             </div>
           </div>
        </div>

        {/* Actions (Bottom) - Hierarchy Strengthened */}
        <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-10 w-full animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500 flex-shrink-0">
           <button 
             onClick={() => navigate('/dashboard')}
             className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold h-12 sm:h-16 rounded-xl sm:rounded-2xl shadow-xl shadow-brand-900/40 flex items-center justify-center gap-2 sm:gap-3 active:scale-[0.98] transition-all text-base sm:text-xl ring-1 ring-white/10"
           >
             <span>Enter Church App</span> <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 opacity-90" />
           </button>
           
           <button 
             onClick={() => navigate('/portal/prayer-request')}
             className="w-full bg-white/5 hover:bg-white/10 backdrop-blur-md text-blue-100 font-medium h-11 sm:h-14 rounded-xl sm:rounded-2xl border border-white/10 flex items-center justify-center gap-2 sm:gap-3 active:scale-[0.98] transition-all text-sm sm:text-base"
           >
             <HeartHandshake className="w-4 h-4 sm:w-5 sm:h-5 opacity-80" /> <span>Prayer Request</span>
           </button>
        </div>

      </div>
    </div>
  );
};

export default Welcome;
