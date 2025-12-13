import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ContentService } from '../services/api';
import { Announcement, SundayService, Devotion } from '../types';
import { Card, Button, Badge } from '../components/UI';
import { ArrowRight, Calendar, BookOpen, PlayCircle } from 'lucide-react';

const Home: React.FC = () => {
  const [featured, setFeatured] = useState<Announcement | null>(null);
  const [nextService, setNextService] = useState<SundayService | null>(null);
  const [todayDevotion, setTodayDevotion] = useState<Devotion | null>(null);

  useEffect(() => {
    ContentService.getAnnouncements().then(list => setFeatured(list.find(a => a.isFeatured) || list[0]));
    ContentService.getServices().then(list => setNextService(list[0]));
    ContentService.getDevotions().then(list => setTodayDevotion(list[0]));
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome Banner / Featured */}
      {featured && (
        <div className="relative rounded-2xl overflow-hidden bg-brand-900 text-white shadow-lg">
          {featured.imageUrl && (
            <img 
              src={featured.imageUrl} 
              alt="Featured" 
              className="absolute inset-0 w-full h-full object-cover opacity-40" 
            />
          )}
          <div className="relative p-5 md:p-8 z-10">
            <Badge color="blue">Featured</Badge>
            <h2 className="mt-2 text-2xl md:text-3xl font-bold leading-tight">{featured.title}</h2>
            <p className="mt-2 text-brand-100 line-clamp-2 max-w-xl">{featured.content}</p>
            <Link to="/announcements" className="mt-4 inline-flex items-center text-white font-medium hover:underline">
              Read more <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { to: '/announcements', label: 'Announcements', icon: '📢', color: 'bg-orange-100 text-orange-700' },
          { to: '/hymnal', label: 'Hymnal', icon: '🎵', color: 'bg-purple-100 text-purple-700' },
          { to: '/sermons', label: 'Sermons', icon: '🎙️', color: 'bg-blue-100 text-blue-700' },
          { to: '/service', label: 'Service', icon: '⛪', color: 'bg-green-100 text-green-700' },
        ].map((action) => (
          <Link key={action.to} to={action.to} className="group">
            <Card className="p-4 flex flex-col items-center justify-center text-center h-full hover:border-brand-300 transition-colors">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-2 ${action.color}`}>
                {action.icon}
              </div>
              <span className="font-medium text-gray-700 group-hover:text-brand-700">{action.label}</span>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Next Service */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-900 flex items-center gap-2"><Calendar className="w-5 h-5 text-brand-600"/> Next Service</h3>
            <Link to="/service" className="text-sm text-brand-600 hover:underline">View all</Link>
          </div>
          {nextService ? (
            <Card className="p-5 border-l-4 border-l-brand-500">
              <div className="text-sm text-gray-500 mb-1">{new Date(nextService.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
              <h4 className="text-lg font-bold text-gray-800 mb-2">{nextService.theme}</h4>
              <div className="text-sm text-gray-600 mb-3 space-y-1">
                <p><span className="font-medium">Preacher:</span> {nextService.preacher}</p>
                <p><span className="font-medium">Readings:</span> {nextService.readings.join(', ')}</p>
              </div>
            </Card>
          ) : <p className="text-gray-500 italic">No upcoming services.</p>}
        </section>

        {/* Today's Devotion */}
        <section>
          <div className="flex items-center justify-between mb-3">
             <h3 className="font-bold text-gray-900 flex items-center gap-2"><BookOpen className="w-5 h-5 text-teal-600"/> Today's Devotion</h3>
             <Link to="/devotion" className="text-sm text-brand-600 hover:underline">Read full</Link>
          </div>
          {todayDevotion ? (
            <Card className="p-5 bg-teal-50 border-teal-100">
              <h4 className="text-lg font-bold text-teal-900 mb-1">{todayDevotion.title}</h4>
              <p className="text-teal-700 font-serif italic mb-3">{todayDevotion.scripture}</p>
              <p className="text-gray-700 line-clamp-3 mb-3">{todayDevotion.content}</p>
              <Link to="/devotion">
                <Button size="sm" variant="secondary" className="w-full">Read Devotion</Button>
              </Link>
            </Card>
          ) : <p className="text-gray-500 italic">No devotion for today.</p>}
        </section>
      </div>
    </div>
  );
};

export default Home;