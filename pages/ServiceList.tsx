import React, { useEffect, useState } from 'react';
import { ContentService } from '../services/api';
import { SundayService } from '../types';
import { PageHeader, LoadingScreen, Card, Badge } from '../components/UI';
import { Calendar, User, Book, Music } from 'lucide-react';

const ServiceList: React.FC = () => {
  const [services, setServices] = useState<SundayService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ContentService.getServices().then(data => {
      setServices(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <div>
      <PageHeader title="Sunday Services" />
      <div className="space-y-6">
        {services.map((service, index) => {
            const isNext = index === 0;
            // Highlight upcoming service with Brand Blue, others neutral
            return (
                <Card key={service.id} className={`p-0 overflow-hidden border-l-[6px] ${isNext ? 'border-l-brand-600 shadow-md' : 'border-l-gray-300 dark:border-l-gray-600'}`}>
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2 text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                <Calendar className="w-4 h-4" />
                                {new Date(service.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </div>
                            {isNext && <Badge color="blue">Upcoming</Badge>}
                        </div>
                        
                        <h2 className="text-2xl font-bold text-brand-900 dark:text-white mb-2">{service.theme}</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-6 text-base leading-relaxed">{service.description}</p>
                        
                        <div className="bg-brand-50 dark:bg-slate-800/50 rounded-xl p-4 md:p-5 grid grid-cols-1 md:grid-cols-2 gap-6 border border-brand-100 dark:border-brand-800">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-brand-100 dark:bg-brand-900/30 rounded-full text-brand-600 dark:text-brand-400">
                                    <User className="w-4 h-4" />
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-gray-400 uppercase block mb-1">Preacher</span>
                                    <span className="text-gray-900 dark:text-white font-medium block">{service.preacher}</span>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-brand-100 dark:bg-brand-900/30 rounded-full text-brand-600 dark:text-brand-400">
                                    <Book className="w-4 h-4" />
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-gray-400 uppercase block mb-1">Scripture Readings</span>
                                    <ul className="text-gray-900 dark:text-white font-medium space-y-1">
                                        {service.readings.map(r => <li key={r}>{r}</li>)}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {service.hymns && (
                            <div className="mt-5 flex items-center gap-3">
                                <Music className="w-4 h-4 text-gray-400" />
                                <div className="flex flex-wrap gap-2">
                                    {service.hymns.map(h => (
                                        <span key={h} className="inline-block bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-200 text-xs font-semibold px-2.5 py-1 rounded-md">
                                            {h}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </Card>
            );
        })}
      </div>
    </div>
  );
};

export default ServiceList;