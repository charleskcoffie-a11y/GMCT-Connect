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

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {events.map(event => {
            const dateObj = new Date(event.date);
            const month = dateObj.toLocaleString('default', { month: 'short' });
            const day = dateObj.getDate();

            // Using Navy for the top border to indicate structure/header
            return (
                <Card key={event.id} variant="standard" className="flex flex-col h-full border-t-[4px] border-t-brand-900">
                    <div className="p-4 flex-1">
                        <div className="flex justify-between items-start mb-3">
                            {/* Calendar Block - Compact */}
                            <div className="flex flex-col items-center justify-center bg-brand-50 text-brand-700 rounded-lg w-12 h-12 border border-brand-100 shadow-sm">
                                <span className="text-[10px] font-bold uppercase tracking-wider">{month}</span>
                                <span className="text-lg font-bold leading-none">{day}</span>
                            </div>
                            <Badge color="blue">{event.category}</Badge>
                        </div>
                        
                        <h3 className="text-lg font-bold text-gray-900 mb-1 leading-tight">{event.title}</h3>
                        <p className="text-gray-600 text-xs line-clamp-2 mb-3 leading-relaxed">{event.description}</p>
                        
                        <div className="space-y-1.5 pt-3 border-t border-gray-100">
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                <Clock className="w-3.5 h-3.5 text-brand-500" /> 
                                <span className="font-medium">{event.time}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                <MapPin className="w-3.5 h-3.5 text-brand-500" /> 
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