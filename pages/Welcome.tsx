import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, HeartHandshake, Church } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const { logoUrl } = useSettings();
  const [imageError, setImageError] = useState(false);

  return (
    <div className="h-[100dvh] w-full bg-app-bg dark:bg-app-darkBg flex flex-col relative overflow-hidden">
      {/* Decorative Background Elements using Brand colors */}
      <div className="absolute top-[-20%] right-[-20%] w-[80vw] h-[80vw] bg-brand-100/40 dark:bg-brand-900/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-brand-200/40 dark:bg-brand-800/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Content Container - Flex Column, Non-scrollable */}
      <div className="flex-1 flex flex-col px-6 py-safe z-10 max-w-md mx-auto w-full h-full">
        
        {/* Header Section (Top) */}
        <div className="mt-12 text-center animate-in slide-in-from-top-8 duration-700 flex-shrink-0">
           <h1 className="text-xs font-bold text-brand-600 dark:text-brand-400 tracking-[0.2em] uppercase mb-3">GMCT Connect</h1>
           <h2 className="text-4xl font-extrabold text-brand-900 dark:text-white tracking-tight">Welcome Home</h2>
        </div>

        {/* Visual Focus (Center - Flex Grow to push content) */}
        <div className="flex-1 flex flex-col justify-center items-center gap-10 animate-in zoom-in-95 duration-700 delay-100 min-h-0">
           {/* Logo Container - Harmonious with Brand */}
           <div className="w-48 h-48 sm:w-56 sm:h-56 bg-white dark:bg-slate-800 rounded-[2rem] shadow-2xl shadow-brand-900/5 dark:shadow-none flex items-center justify-center relative p-6 border border-white dark:border-slate-700 ring-4 ring-brand-50 dark:ring-brand-900/30">
              {logoUrl && !imageError ? (
                <img 
                  src={logoUrl}
                  alt="GMCT Logo" 
                  className="w-full h-full object-contain"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-brand-600 dark:text-brand-400">
                   <Church className="w-20 h-20 mb-2 opacity-20" />
                   <span className="text-sm font-bold tracking-widest uppercase opacity-40">GMCT</span>
                </div>
              )}
           </div>
           
           <div className="text-center px-4">
             <p className="text-app-subtext dark:text-gray-400 font-medium text-lg leading-relaxed">
               "For where two or three gather in my name, there am I with them."
             </p>
           </div>
        </div>

        {/* Actions (Bottom) */}
        <div className="space-y-4 mb-8 sm:mb-12 w-full animate-in slide-in-from-bottom-8 duration-700 delay-200 flex-shrink-0">
           <button 
             onClick={() => navigate('/dashboard')}
             className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold h-14 rounded-2xl shadow-lg shadow-brand-500/20 flex items-center justify-center gap-3 active:scale-[0.98] transition-all text-lg"
           >
             Enter App <ArrowRight className="w-5 h-5 opacity-80" />
           </button>
           
           <button 
             onClick={() => navigate('/portal/prayer-request')}
             className="w-full bg-white dark:bg-slate-800 text-app-subtext dark:text-gray-300 font-semibold h-14 rounded-2xl border border-app-border dark:border-gray-700 flex items-center justify-center gap-3 active:scale-[0.98] transition-all hover:bg-brand-50 dark:hover:bg-slate-700"
           >
             <HeartHandshake className="w-5 h-5 text-brand-600" /> Send Prayer Request
           </button>
        </div>

        {/* Footer */}
        <div className="text-center pb-2 animate-in fade-in duration-1000 delay-500 flex-shrink-0">
           <p className="text-[10px] text-gray-300 dark:text-gray-600 font-bold tracking-widest uppercase">Ghana Methodist Church of Toronto</p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;