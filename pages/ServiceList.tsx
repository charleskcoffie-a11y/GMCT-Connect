
import React, { useEffect, useState } from 'react';
import { ContentService } from '../services/api';
import { SundayService } from '../types';
import { PageHeader, LoadingScreen, Card, Badge } from '../components/UI';
import { Calendar, User, Book } from 'lucide-react';

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
            return (
                <Card key={service.id} variant="standard" className={`p-0 overflow-hidden border-l-[6px] ${isNext ? 'border-l-brand-600 shadow-md' : 'border-l-gray-300'}`}>
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2 text-sm font-bold text-gray-500 uppercase tracking-wide">
                                <Calendar className="w-4 h-4" />
                                {new Date(service.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </div>
                            {isNext && <Badge color="blue">Upcoming</Badge>}
                        </div>
                        
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{service.theme}</h2>
                        {service.serviceType && (
                           <div className="mb-4">
                              <Badge color="purple">{service.serviceType}</Badge>
                           </div>
                        )}
                        <p className="text-gray-600 mb-6 text-base leading-relaxed">{service.description}</p>
                        
                        <div className="bg-brand-50 rounded-xl p-4 md:p-5 grid grid-cols-1 md:grid-cols-2 gap-6 border border-brand-100">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-brand-100 rounded-full text-brand-600">
                                    <User className="w-4 h-4" />
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-gray-400 uppercase block mb-1">Preacher</span>
                                    <span className="text-gray-900 font-medium block">{service.preacher}</span>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-brand-100 rounded-full text-brand-600">
                                    <Book className="w-4 h-4" />
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-gray-400 uppercase block mb-1">Scripture Readings</span>
                                    <ul className="text-gray-900 font-medium space-y-1">
                                        {service.readings.map((r, i) => (
                                          <li key={i}>{r}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            );
        })}
      </div>
    </div>
  );
};

export default ServiceList;
