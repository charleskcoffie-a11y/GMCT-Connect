
import React, { useState, useEffect } from 'react';
import { AdminService, ContentService } from '../../../services/api';
import { SundayService } from '../../../types';
import { PageHeader, Card, Button, LoadingScreen } from '../../../components/UI';
import { Calendar, Save, PlusCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ServicePlanner: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // State for 4 upcoming services
  const [services, setServices] = useState<Partial<SundayService>[]>([]);

  useEffect(() => {
    // Initialize with next 4 Sundays
    const initialServices: Partial<SundayService>[] = [];
    let currentDate = new Date();
    // Find next Sunday
    currentDate.setDate(currentDate.getDate() + (7 - currentDate.getDay()) % 7);
    if (currentDate.getDay() !== 0) currentDate.setDate(currentDate.getDate() + (7 - currentDate.getDay()));

    for (let i = 0; i < 4; i++) {
        const d = new Date(currentDate);
        d.setDate(currentDate.getDate() + (i * 7));
        
        initialServices.push({
            id: `svc_${d.getTime()}`, // Temporary ID
            date: d.toISOString().split('T')[0],
            theme: '',
            preacher: '',
            serviceType: 'Matins',
            readings: ['', '', ''], // 3 slots
            description: ''
        });
    }
    
    // Check if we have existing data for these dates
    ContentService.getServices().then(existing => {
        const merged = initialServices.map(init => {
            const found = existing.find(e => e.date === init.date);
            if (found) {
                // Ensure reading array has 3 slots
                const paddedReadings = [...found.readings];
                while(paddedReadings.length < 3) paddedReadings.push('');
                return { ...found, readings: paddedReadings };
            }
            return init;
        });
        setServices(merged);
    });
  }, []);

  const handleChange = (index: number, field: keyof SundayService, value: any) => {
      const updated = [...services];
      updated[index] = { ...updated[index], [field]: value };
      setServices(updated);
  };

  const handleReadingChange = (serviceIndex: number, readingIndex: number, value: string) => {
      const updated = [...services];
      const newReadings = [...(updated[serviceIndex].readings || [])];
      newReadings[readingIndex] = value;
      updated[serviceIndex] = { ...updated[serviceIndex], readings: newReadings };
      setServices(updated);
  };

  const handleSave = async () => {
      setSaving(true);
      // Filter out empty forms if needed, but here we save all 4
      const toSave = services.map(s => ({
          ...s,
          readings: s.readings?.filter(r => r.trim() !== '') || [] // Clean up empty strings
      })) as SundayService[];

      await AdminService.saveServices(toSave);
      setSaving(false);
      alert('Services schedule updated successfully.');
      navigate('/portal/minister');
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex items-center gap-2 mb-2">
         <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-full text-white">
            <ArrowLeft className="w-5 h-5" />
         </button>
         <PageHeader title="Service Planner" />
      </div>
      
      <p className="text-gray-400 mb-6 -mt-4">Plan the liturgy for the next 4 Sundays. This information will appear on the Home screen.</p>

      <div className="space-y-6">
          {services.map((service, index) => (
              <Card key={index} className="p-6 border-l-4 border-l-brand-500 relative">
                  <div className="absolute top-4 right-4 bg-brand-50 text-brand-700 px-3 py-1 rounded-full text-xs font-bold">
                      Week {index + 1}
                  </div>
                  
                  <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-gray-100 rounded-lg">
                          <Calendar className="w-6 h-6 text-gray-600" />
                      </div>
                      <div>
                          <input 
                            type="date" 
                            className="bg-transparent font-bold text-xl text-gray-900 border-b border-dashed border-gray-300 focus:border-brand-500 outline-none"
                            value={service.date}
                            onChange={(e) => handleChange(index, 'date', e.target.value)}
                          />
                          <p className="text-xs text-gray-500 mt-1">Service Date</p>
                      </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                          <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-1">Theme</label>
                              <input 
                                className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-brand-500 outline-none"
                                placeholder="e.g. The Power of Grace"
                                value={service.theme}
                                onChange={(e) => handleChange(index, 'theme', e.target.value)}
                              />
                          </div>
                          <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-1">Preacher</label>
                              <input 
                                className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-brand-500 outline-none"
                                placeholder="e.g. Rev. John Doe"
                                value={service.preacher}
                                onChange={(e) => handleChange(index, 'preacher', e.target.value)}
                              />
                          </div>
                          <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-1">Service Type</label>
                              <select 
                                className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-brand-500 outline-none bg-white"
                                value={service.serviceType}
                                onChange={(e) => handleChange(index, 'serviceType', e.target.value)}
                              >
                                  <option value="Matins">Matins</option>
                                  <option value="Communion">Communion</option>
                                  <option value="Evensong">Evensong</option>
                                  <option value="Praise & Worship">Praise & Worship</option>
                                  <option value="Special">Special Service</option>
                              </select>
                          </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                          <h4 className="font-bold text-sm text-gray-500 uppercase tracking-wide mb-3">Scripture Readings</h4>
                          <div className="space-y-3">
                              <div>
                                  <label className="text-xs font-semibold text-gray-500">1st Reading (O.T)</label>
                                  <input 
                                    className="w-full border rounded p-2 text-sm focus:border-brand-500 outline-none"
                                    placeholder="e.g. Genesis 1:1-4"
                                    value={service.readings?.[0] || ''}
                                    onChange={(e) => handleReadingChange(index, 0, e.target.value)}
                                  />
                              </div>
                              <div>
                                  <label className="text-xs font-semibold text-gray-500">2nd Reading (Epistle)</label>
                                  <input 
                                    className="w-full border rounded p-2 text-sm focus:border-brand-500 outline-none"
                                    placeholder="e.g. Romans 8:1-4"
                                    value={service.readings?.[1] || ''}
                                    onChange={(e) => handleReadingChange(index, 1, e.target.value)}
                                  />
                              </div>
                              <div>
                                  <label className="text-xs font-semibold text-gray-500">3rd Reading (Gospel)</label>
                                  <input 
                                    className="w-full border rounded p-2 text-sm focus:border-brand-500 outline-none"
                                    placeholder="e.g. Matthew 5:1-12"
                                    value={service.readings?.[2] || ''}
                                    onChange={(e) => handleReadingChange(index, 2, e.target.value)}
                                  />
                              </div>
                          </div>
                      </div>
                  </div>
              </Card>
          ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 z-50 md:pl-72 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => navigate(-1)}>Cancel</Button>
          <Button onClick={handleSave} isLoading={saving} className="shadow-lg gap-2">
              <Save className="w-4 h-4" /> Save Schedule
          </Button>
      </div>
    </div>
  );
};

export default ServicePlanner;
