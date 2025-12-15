
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { ContentService } from '../services/api';
import { Announcement, SundayService, Devotion } from '../types';
import { Card, Badge } from '../components/UI';
import { ArrowRight, BookOpen, Mic2, Music, Sun, Church, Calendar, User } from 'lucide-react';

const Home: React.FC = () => {
  const { user } = useAuth();
  const { logoUrl } = useSettings();
  const [featured, setFeatured] = useState<Announcement | null>(null);
  const [nextService, setNextService] = useState<SundayService | null>(null);
  const [todayDevotion, setTodayDevotion] = useState<Devotion | null>(null);

  useEffect(() => {
    ContentService.getAnnouncements().then(list => setFeatured(list.find(a => a.isFeatured) || list[0]));
    
    // Logic to find the Next Upcoming Service
    ContentService.getServices().then(list => {
        const today = new Date();
        today.setHours(0,0,0,0);
        // Filter for services today or in the future
        const upcoming = list.filter(s => new Date(s.date) >= today);
        // Sort by date ascending and pick the first one
        upcoming.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setNextService(upcoming[0] || null);
    });

    ContentService.getDevotions().then(list => setTodayDevotion(list[0]));
  }, []);

  // Greeting based on time
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* Home Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:mb-6">
        <div>
           <p className="text-sm font-semibold text-blue-200 uppercase tracking-wide">{greeting},</p>
           <h1 className="text-3xl font-extrabold text-white leading-tight drop-shadow-sm">
             {user?.name.split(' ')[0] || 'Friend'}
           </h1>
        </div>
      </div>

      {/* Featured Banner - Hero Glass Card */}
      {featured && (
        <Card variant="glass" className="relative h-52 md:h-64 border-white/20 group overflow-hidden">
          {featured.imageUrl && (
            <img 
              src={featured.imageUrl} 
              alt="Featured" 
              className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105" 
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
          <div className="relative p-5 md:p-8 z-10 flex flex-col items-start h-full justify-end">
            <div className="mb-auto pt-2">
               <Badge color="blue">Latest News</Badge>
            </div>
            <h2 className="text-xl md:text-3xl font-bold leading-tight tracking-tight text-white mb-2 line-clamp-1">{featured.title}</h2>
            <p className="text-gray-200 line-clamp-2 max-w-xl text-sm md:text-base font-medium opacity-90 mb-3">{featured.content}</p>
            <Link to="/announcements" className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white font-semibold hover:bg-white/30 transition-all flex items-center text-sm">
              Read More <ArrowRight className="ml-2 w-3 h-3" />
            </Link>
          </div>
        </Card>
      )}

      {/* Quick Actions Grid - Standard White Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { to: '/announcements', label: 'Announcements', icon: Mic2 },
          { to: '/hymnal', label: 'Hymnal', icon: Music },
          { to: '/portal', label: 'My Portal', icon: Church },
          { to: '/service', label: 'Service', icon: Sun },
        ].map((action) => (
          <Link key={action.to} to={action.to} className="group">
            <Card variant="standard" className="p-4 flex flex-col items-center justify-center text-center h-full hover:shadow-lg hover:border-brand-200 transition-all">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-brand-50 text-brand-600 transition-transform group-hover:scale-110">
                <action.icon className="w-6 h-6" />
              </div>
              <span className="font-semibold text-gray-900 text-sm">{action.label}</span>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Next Service Card - Standard */}
        <section>
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="font-bold text-white text-lg flex items-center gap-2">
               Upcoming Service
            </h3>
            <Link to="/service" className="text-sm font-semibold text-blue-200 hover:text-white transition-colors">View Details</Link>
          </div>
          {nextService ? (
            <Card variant="standard" className="p-0 border-l-[6px] border-l-brand-600 relative overflow-hidden">
               <div className="p-6">
                 <div className="flex justify-between items-start mb-4">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-bold bg-brand-50 text-brand-700 uppercase tracking-wide">
                        <Calendar className="w-3 h-3" />
                        {new Date(nextService.date).toLocaleDateString('en-US', { weekday: 'long', day: 'numeric' })}
                    </span>
                    {nextService.serviceType && (
                        <Badge color="blue">{nextService.serviceType}</Badge>
                    )}
                 </div>
                 <h4 className="text-xl font-bold text-gray-900 mb-2 leading-tight">{nextService.theme}</h4>
                 
                 <div className="space-y-4 mt-5 pt-4 border-t border-gray-100">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center mt-1">
                           <User className="w-4 h-4 text-brand-600" />
                        </div>
                        <div>
                            <span className="text-xs font-bold text-gray-400 uppercase block mb-0.5">Preacher</span>
                            <div className="text-gray-900 text-sm font-bold">{nextService.preacher}</div>
                        </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center mt-1">
                           <BookOpen className="w-4 h-4 text-brand-600" />
                        </div>
                        <div className="flex-1">
                            <span className="text-xs font-bold text-gray-400 uppercase block mb-1">Scripture Readings</span>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {nextService.readings.filter(r => r).map((r, i) => (
                                    <span key={i} className="text-xs font-medium bg-gray-100 text-gray-700 px-2 py-1 rounded border border-gray-200 truncate">
                                        {r}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                 </div>
               </div>
            </Card>
          ) : <p className="text-blue-200 italic">No upcoming services scheduled.</p>}
        </section>

        {/* Today's Devotion Card - Standard */}
        <section>
          <div className="flex items-center justify-between mb-4 px-1">
             <h3 className="font-bold text-white text-lg">Daily Word</h3>
             <Link to="/devotion" className="text-sm font-semibold text-blue-200 hover:text-white transition-colors">Open</Link>
          </div>
          {todayDevotion ? (
            <Card variant="standard" className="p-0 border-l-[6px] border-l-accent-500">
              <div className="p-6">
                 <div className="mb-3">
                    <span className="text-accent-600 text-xs font-bold uppercase tracking-wider">Devotion</span>
                 </div>
                 <h4 className="text-xl font-bold text-gray-900 mb-2">{todayDevotion.title}</h4>
                 <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed mb-4">
                    {todayDevotion.content}
                 </p>
                 <div className="flex items-center text-sm font-medium text-accent-700 italic bg-accent-50 p-3 rounded-lg border border-accent-100">
                    <BookOpen className="w-4 h-4 mr-2 flex-shrink-0" />
                    {todayDevotion.scripture}
                 </div>
              </div>
            </Card>
          ) : <p className="text-blue-200 italic">No devotion for today.</p>}
        </section>
      </div>
    </div>
  );
};

export default Home;
