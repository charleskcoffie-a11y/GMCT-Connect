import React, { useEffect, useState } from 'react';
import { ContentService } from '../services/api';
import { Event } from '../types';
import { PageHeader, LoadingScreen, Card, Badge } from '../components/UI';
import { MapPin, Clock } from 'lucide-react';

const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ContentService.getEvents().then(data => {
      setEvents(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <div>
      <PageHeader title="Programs & Events" />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {events.map(event => {
            const dateObj = new Date(event.date);
            const month = dateObj.toLocaleString('default', { month: 'short' });
            const day = dateObj.getDate();

            // Using Navy for the top border to indicate structure/header
            return (
                <Card key={event.id} className="flex flex-col h-full border-t-[6px] border-t-brand-900">
                    <div className="p-6 flex-1">
                        <div className="flex justify-between items-start mb-5">
                            {/* Calendar Block - Brand Blue */}
                            <div className="flex flex-col items-center justify-center bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 rounded-xl w-14 h-14 border border-brand-100 dark:border-brand-800 shadow-sm">
                                <span className="text-xs font-bold uppercase tracking-wider">{month}</span>
                                <span className="text-xl font-bold leading-none">{day}</span>
                            </div>
                            <Badge color="blue">{event.category}</Badge>
                        </div>
                        
                        <h3 className="text-xl font-bold text-brand-900 dark:text-white mb-2 leading-tight">{event.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-6 leading-relaxed">{event.description}</p>
                        
                        <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                                <Clock className="w-4 h-4 text-brand-500" /> 
                                <span className="font-medium">{event.time}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                                <MapPin className="w-4 h-4 text-brand-500" /> 
                                <span className="font-medium">{event.location}</span>
                            </div>
                        </div>
                    </div>
                </Card>
            )
        })}
      </div>
    </div>
  );
};

export default Events;