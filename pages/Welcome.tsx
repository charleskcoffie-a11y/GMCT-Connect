
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
      {/* Decorative Background Elements using Brand colors */}
      {/* Primary Blue Glow - Top Right */}
      <div className="absolute top-[-15%] right-[-15%] w-[90vw] h-[90vw] bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Middle Section Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] bg-brand-600/5 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-blue-400/10 rounded-full blur-[60px] pointer-events-none" />

      {/* Secondary Glow - Bottom Left */}
      <div className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-brand-200/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Content Container - Flex Column, Non-scrollable */}
      <div className="flex-1 flex flex-col px-6 py-safe z-10 max-w-md mx-auto w-full h-full">
        
        {/* Header Section (Top) */}
        <div className="mt-12 text-center animate-in fade-in slide-in-from-top-4 duration-1000 flex-shrink-0">
           <h1 className="text-xs font-bold text-gray-400 tracking-[0.2em] uppercase mb-3">GMCT Connect</h1>
           <h2 className="text-4xl font-extrabold text-white tracking-tight">Welcome Home</h2>
        </div>

        {/* Visual Focus (Center - Flex Grow to push content) */}
        <div className="flex-1 flex flex-col justify-center items-center gap-10 min-h-0">
           {/* Logo Container - Subtle Fade & Scale Animation */}
           <div className="w-48 h-48 sm:w-56 sm:h-56 bg-white dark:bg-slate-800 rounded-full shadow-2xl shadow-brand-900/20 flex items-center justify-center relative p-8 border border-white/20 ring-4 ring-white/5 animate-in fade-in zoom-in-90 duration-1000 delay-200">
              {logoUrl && !imageError ? (
                <img 
                  src={logoUrl}
                  alt="GMCT Logo" 
                  className="w-full h-full object-contain rounded-full"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-brand-600 dark:text-brand-400">
                   <Church className="w-24 h-24 mb-2 opacity-20" />
                   <span className="text-sm font-bold tracking-widest uppercase opacity-40">GMCT</span>
                </div>
              )}
           </div>
           
           <div className="text-center px-4 animate-in fade-in slide-in-from-bottom-2 duration-1000 delay-300 w-full flex justify-center">
             <div className="bg-white/10 border border-white/10 rounded-3xl px-8 py-4 shadow-xl shadow-black/20 max-w-sm backdrop-blur-sm bg-opacity-95">
               <p className="text-white font-bold text-lg leading-relaxed">
                 "Walking in the Word: Equipped for Every Good Work."
               </p>
             </div>
           </div>
        </div>

        {/* Actions (Bottom) */}
        <div className="space-y-4 mb-8 sm:mb-12 w-full animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500 flex-shrink-0">
           <button 
             onClick={() => navigate('/dashboard')}
             className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold h-14 rounded-2xl shadow-lg shadow-brand-500/20 flex items-center justify-center gap-3 active:scale-[0.98] transition-all text-lg"
           >
             Enter App <ArrowRight className="w-5 h-5 opacity-80" />
           </button>
           
           <button 
             onClick={() => navigate('/portal/prayer-request')}
             className="w-full bg-white/10 backdrop-blur-md text-gray-200 font-semibold h-14 rounded-2xl border border-white/10 flex items-center justify-center gap-3 active:scale-[0.98] transition-all hover:bg-white/20"
           >
             <HeartHandshake className="w-5 h-5 text-brand-400" /> Send Prayer Request
           </button>
        </div>

        {/* Footer */}
        <div className="text-center pb-2 animate-in fade-in duration-1000 delay-700 flex-shrink-0">
           <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">Ghana Methodist Church of Toronto</p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
