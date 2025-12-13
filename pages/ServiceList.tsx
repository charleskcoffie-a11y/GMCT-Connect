import React, { useEffect, useState } from 'react';
import { ContentService } from '../services/api';
import { SundayService } from '../types';
import { PageHeader, LoadingScreen, Card } from '../components/UI';
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
        {services.map((service, index) => (
            <Card key={service.id} className="p-6 relative overflow-hidden">
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${index === 0 ? 'bg-brand-500' : 'bg-gray-300'}`}></div>
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    <div className="flex-1">
                        <div className="text-sm font-bold text-gray-500 mb-1">
                            {new Date(service.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">{service.theme}</h2>
                        <p className="text-gray-600 mb-4 text-sm">{service.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="flex items-start gap-2">
                                <User className="w-4 h-4 text-gray-400 mt-0.5" />
                                <div>
                                    <span className="font-semibold block text-gray-700">Preacher</span>
                                    <span className="text-gray-600">{service.preacher}</span>
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <Book className="w-4 h-4 text-gray-400 mt-0.5" />
                                <div>
                                    <span className="font-semibold block text-gray-700">Readings</span>
                                    <ul className="text-gray-600 list-disc list-inside">
                                        {service.readings.map(r => <li key={r}>{r}</li>)}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {service.hymns && (
                    <div className="mt-6 pt-4 border-t border-gray-100">
                        <span className="text-xs font-bold text-gray-500 uppercase mr-2">Hymns:</span>
                        {service.hymns.map(h => (
                            <span key={h} className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded mr-2 mb-1">{h}</span>
                        ))}
                    </div>
                )}
            </Card>
        ))}
      </div>
    </div>
  );
};

export default ServiceList;
