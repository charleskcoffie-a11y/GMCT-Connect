import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { ContentService } from '../services/api';
import { Announcement, SundayService, Devotion } from '../types';
import { Card, Badge } from '../components/UI';
import { ArrowRight, BookOpen, Mic2, Music, Sun, Church } from 'lucide-react';

const Home: React.FC = () => {
  const { user } = useAuth();
  const { logoUrl } = useSettings();
  const [featured, setFeatured] = useState<Announcement | null>(null);
  const [nextService, setNextService] = useState<SundayService | null>(null);
  const [todayDevotion, setTodayDevotion] = useState<Devotion | null>(null);

  useEffect(() => {
    ContentService.getAnnouncements().then(list => setFeatured(list.find(a => a.isFeatured) || list[0]));
    ContentService.getServices().then(list => setNextService(list[0]));
    ContentService.getDevotions().then(list => setTodayDevotion(list[0]));
  }, []);

  // Greeting based on time
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Home Header - Dynamic Logo */}
      <div className="flex items-center gap-4 md:mb-6">
        <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-brand-100 dark:border-brand-900 items-center justify-center p-2 hidden md:flex">
           {logoUrl ? (
             <img src={logoUrl} alt="GMCT" className="w-full h-full object-contain" />
           ) : (
             <Church className="w-8 h-8 text-brand-600 opacity-50" />
           )}
        </div>
        <div>
           <p className="text-sm font-semibold text-app-subtext dark:text-gray-400 uppercase tracking-wide">{greeting},</p>
           <h1 className="text-2xl md:text-3xl font-extrabold text-brand-900 dark:text-white leading-tight">
             {user?.name.split(' ')[0] || 'Friend'}
           </h1>
        </div>
      </div>

      {/* Featured Banner - Brand Navy Primary */}
      {featured && (
        <div className="relative rounded-3xl overflow-hidden bg-brand-900 text-white shadow-xl shadow-brand-900/20 group cursor-pointer h-64 md:h-80 border border-brand-800">
          {featured.imageUrl && (
            <img 
              src={featured.imageUrl} 
              alt="Featured" 
              className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105" 
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-900 via-brand-900/50 to-transparent"></div>
          <div className="relative p-6 md:p-10 z-10 flex flex-col items-start h-full justify-end">
            <Badge color="blue">Latest News</Badge>
            <h2 className="mt-3 text-2xl md:text-4xl font-bold leading-tight tracking-tight text-white mb-2">{featured.title}</h2>
            <p className="text-brand-100 line-clamp-2 max-w-xl text-base md:text-lg font-medium opacity-90">{featured.content}</p>
            <Link to="/announcements" className="mt-6 px-5 py-2.5 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white font-semibold hover:bg-white/30 transition-all flex items-center">
              Read More <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Quick Actions Grid - Brand Blue Highlights */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { to: '/announcements', label: 'Announcements', icon: Mic2 },
          { to: '/hymnal', label: 'Hymnal', icon: Music },
          { to: '/portal', label: 'My Portal', icon: Church },
          { to: '/service', label: 'Service', icon: Sun },
        ].map((action) => (
          <Link key={action.to} to={action.to} className="group">
            <div className="bg-app-card dark:bg-app-darkCard rounded-2xl p-4 flex flex-col items-center justify-center text-center h-full shadow-native hover:shadow-native-hover transition-all border border-app-border dark:border-app-darkBorder">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 transition-transform group-hover:scale-110">
                <action.icon className="w-6 h-6" />
              </div>
              <span className="font-semibold text-brand-900 dark:text-gray-100 text-sm">{action.label}</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Next Service Card - Brand Blue/Navy Emphasis */}
        <section>
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="font-bold text-brand-900 dark:text-white text-lg flex items-center gap-2">
               Upcoming Service
            </h3>
            <Link to="/service" className="text-sm font-semibold text-brand-600 hover:text-brand-700">View Details</Link>
          </div>
          {nextService ? (
            <Card className="p-0 border-l-[6px] border-l-brand-600 overflow-hidden relative">
               <div className="p-6">
                 <div className="flex justify-between items-start mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300 uppercase tracking-wide">
                        {new Date(nextService.date).toLocaleDateString('en-US', { weekday: 'long', day: 'numeric' })}
                    </span>
                 </div>
                 <h4 className="text-xl font-bold text-brand-900 dark:text-white mb-2 leading-tight">{nextService.theme}</h4>
                 <div className="space-y-3 mt-4 pt-4 border-t border-app-border dark:border-app-darkBorder">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-50 dark:bg-slate-700 flex items-center justify-center">
                           <span className="text-xs font-bold text-brand-600 dark:text-brand-300">P</span>
                        </div>
                        <div className="text-gray-700 dark:text-gray-300 text-sm font-medium">{nextService.preacher}</div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-50 dark:bg-slate-700 flex items-center justify-center">
                           <BookOpen className="w-4 h-4 text-brand-600 dark:text-brand-300" />
                        </div>
                        <div className="text-gray-700 dark:text-gray-300 text-sm">{nextService.readings[0]}</div>
                    </div>
                 </div>
               </div>
            </Card>
          ) : <p className="text-app-subtext italic">No upcoming services.</p>}
        </section>

        {/* Today's Devotion Card - Gold Accent Emphasis (Worship) */}
        <section>
          <div className="flex items-center justify-between mb-4 px-1">
             <h3 className="font-bold text-brand-900 dark:text-white text-lg">Daily Word</h3>
             <Link to="/devotion" className="text-sm font-semibold text-brand-600 hover:text-brand-700">Open</Link>
          </div>
          {todayDevotion ? (
            <Card className="p-0 border-l-[6px] border-l-accent-500">
              <div className="p-6">
                 <div className="mb-3">
                    <span className="text-accent-600 dark:text-accent-400 text-xs font-bold uppercase tracking-wider">Devotion</span>
                 </div>
                 <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{todayDevotion.title}</h4>
                 <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 leading-relaxed mb-4">
                    {todayDevotion.content}
                 </p>
                 <div className="flex items-center text-sm font-medium text-accent-700 dark:text-accent-300 italic bg-accent-50 dark:bg-accent-900/20 p-3 rounded-lg border border-accent-100 dark:border-accent-800">
                    <BookOpen className="w-4 h-4 mr-2 flex-shrink-0" />
                    {todayDevotion.scripture}
                 </div>
              </div>
            </Card>
          ) : <p className="text-app-subtext italic">No devotion for today.</p>}
        </section>
      </div>
    </div>
  );
};

export default Home;