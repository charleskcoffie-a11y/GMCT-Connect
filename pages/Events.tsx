import React, { useEffect, useState } from 'react';
import { ContentService } from '../services/api';
import { Event } from '../types';
import { PageHeader, LoadingScreen, Card, Badge } from '../components/UI';
import { Calendar, MapPin, Clock } from 'lucide-react';

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

            return (
                <Card key={event.id} className="flex flex-col h-full hover:border-brand-300 transition-colors">
                    <div className="p-5 flex-1">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex flex-col items-center justify-center bg-brand-50 text-brand-700 rounded-lg w-14 h-14 border border-brand-100">
                                <span className="text-xs font-bold uppercase">{month}</span>
                                <span className="text-xl font-bold leading-none">{day}</span>
                            </div>
                            <Badge>{event.category}</Badge>
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-4">{event.description}</p>
                        
                        <div className="space-y-2 text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" /> <span>{event.time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" /> <span>{event.location}</span>
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
