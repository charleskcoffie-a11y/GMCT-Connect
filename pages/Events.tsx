
import React, { useEffect, useState } from 'react';
import { ContentService } from '../services/api';
import { Event } from '../types';
import { PageHeader, LoadingScreen } from '../components/UI';
import { MapPin, Clock, CalendarPlus } from 'lucide-react';

const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ContentService.getEvents().then(data => {
      // Sort by date upcoming
      const sorted = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setEvents(sorted);
      setLoading(false);
    });
  }, []);

  const getTheme = (category: string) => {
      switch(category) {
          case 'Service': 
              return { 
                  bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-100', 
                  iconColor: 'text-purple-600', badge: 'bg-purple-100 text-purple-700'
              };
          case 'Program': 
              return { 
                  bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100', 
                  iconColor: 'text-blue-600', badge: 'bg-blue-100 text-blue-700'
              };
          case 'Meeting': 
              return { 
                  bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-100', 
                  iconColor: 'text-amber-600', badge: 'bg-amber-100 text-amber-800'
              };
          case 'Social': 
              return { 
                  bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-100', 
                  iconColor: 'text-rose-600', badge: 'bg-rose-100 text-rose-700'
              };
          default: 
              return { 
                  bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100', 
                  iconColor: 'text-emerald-600', badge: 'bg-emerald-100 text-emerald-700'
              };
      }
  };

  const handleAddToCalendar = (event: Event) => {
      alert(`Added "${event.title}" to your calendar!`);
  };

  if (loading) return <LoadingScreen />;

  return (
    <div>
      <PageHeader title="Programs & Events" />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map(event => {
            const dateObj = new Date(event.date);
            const month = dateObj.toLocaleString('default', { month: 'short' });
            const day = dateObj.getDate();
            const theme = getTheme(event.category);

            return (
                <div 
                    key={event.id} 
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full group transform hover:-translate-y-1"
                >
                    <div className="p-6 flex flex-col h-full">
                        {/* Header: Date & Category */}
                        <div className="flex justify-between items-start mb-4">
                            <div className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl border ${theme.border} ${theme.bg} shadow-sm`}>
                                <span className={`text-[10px] font-bold uppercase tracking-wider ${theme.text} opacity-80`}>{month}</span>
                                <span className={`text-xl font-extrabold leading-none ${theme.text}`}>{day}</span>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border border-transparent ${theme.badge}`}>
                                {event.category}
                            </span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 mb-4">
                            <h3 className="text-xl font-extrabold text-gray-900 leading-tight mb-2 tracking-tight group-hover:text-brand-600 transition-colors">
                                {event.title}
                            </h3>
                            <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                                {event.description}
                            </p>
                        </div>

                        {/* Details */}
                        <div className="space-y-3 mb-5 pt-4 border-t border-gray-50">
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <div className={`p-1.5 rounded-lg ${theme.bg}`}>
                                    <Clock className={`w-4 h-4 ${theme.iconColor}`} />
                                </div>
                                <span className="font-medium">{event.time}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <div className={`p-1.5 rounded-lg ${theme.bg}`}>
                                    <MapPin className={`w-4 h-4 ${theme.iconColor}`} />
                                </div>
                                <span className="font-medium">{event.location}</span>
                            </div>
                        </div>

                        {/* Action */}
                        <button 
                            onClick={() => handleAddToCalendar(event)}
                            className={`w-full py-2.5 rounded-xl border border-dashed border-gray-300 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 text-gray-500 font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]`}
                        >
                            <CalendarPlus className="w-4 h-4" /> Add to Calendar
                        </button>
                    </div>
                </div>
            )
        })}
        
        {events.length === 0 && (
            <div className="col-span-full text-center py-20">
                <div className="bg-white/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
                    <CalendarPlus className="w-10 h-10 text-white/40" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No Upcoming Events</h3>
                <p className="text-white/60 font-medium">Check back later for new programs.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default Events;
