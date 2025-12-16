
import React, { useEffect, useState } from 'react';
import { PageHeader, Card, Button, LoadingScreen } from '../components/UI';
import { OutreachService, AdminService } from '../services/api';
import { ChurchBranch } from '../types';
import { MapPin, Clock, Phone, Navigation, Send } from 'lucide-react';

const Locations: React.FC = () => {
  const [branches, setBranches] = useState<ChurchBranch[]>([]);
  const [loading, setLoading] = useState(true);
   const [selectedId, setSelectedId] = useState<string | null>(null);
   const [showMessage, setShowMessage] = useState(false);
   const [msgLoading, setMsgLoading] = useState(false);
   const [messageForm, setMessageForm] = useState({ senderName: '', phone: '', text: '' });

  useEffect(() => {
    OutreachService.getBranches().then(data => {
      setBranches(data);
      setLoading(false);
         if (data.length > 0) setSelectedId(data[0].id);
    });
  }, []);
   const selected = branches.find(b => b.id === selectedId) || null;

   const sendMessage = async (e: React.FormEvent) => {
      e.preventDefault();
      setMsgLoading(true);
      try {
         await AdminService.sendMessageToMinister({ ...messageForm });
         alert('Message sent to Rev. Minister.');
         setShowMessage(false);
         setMessageForm({ senderName: '', phone: '', text: '' });
      } finally {
         setMsgLoading(false);
      }
   };

  if (loading) return <LoadingScreen />;

   return (
    <div>
      <PageHeader title="Our Locations" />
      <p className="text-blue-200 mb-8 -mt-4 text-lg">Join us for worship at a campus near you.</p>

         <Card className="p-6 mb-6">
            <div className="grid md:grid-cols-3 gap-4 items-start">
               <div className="md:col-span-1">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Select Methodist Branch</label>
                  <select
                     className="w-full border rounded-lg p-3 bg-white"
                     value={selectedId || ''}
                     onChange={e => setSelectedId(e.target.value)}
                  >
                     {branches.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                     ))}
                  </select>
               </div>
               {selected && (
                  <div className="md:col-span-2 space-y-3">
                     <div className="flex gap-3 items-start">
                        <MapPin className="w-5 h-5 text-brand-600 mt-1" />
                        <div>
                           <p className="font-bold text-gray-900">{selected.name}</p>
                           <p className="text-gray-600">{selected.address}</p>
                        </div>
                     </div>
                     <div className="flex gap-3 items-start">
                        <Phone className="w-5 h-5 text-brand-600 mt-1" />
                        <p className="text-gray-600">{selected.contactPhone}</p>
                     </div>
                     <div className="flex gap-3">
                        <a href={selected.googleMapsUrl} target="_blank" rel="noopener noreferrer">
                           <Button variant="outline" className="gap-2"><Navigation className="w-4 h-4" /> Directions</Button>
                        </a>
                        <Button className="gap-2" onClick={() => setShowMessage(true)}><Send className="w-4 h-4" /> Message Minister</Button>
                     </div>
                  </div>
               )}
            </div>
            {showMessage && (
               <div className="mt-6 border-t pt-6">
                  <h4 className="font-bold text-gray-900 mb-3">Send Message to Rev. Minister</h4>
                  <form onSubmit={sendMessage} className="grid md:grid-cols-3 gap-4">
                     <input
                        required
                        className="border rounded-lg p-3 bg-gray-50 md:col-span-1"
                        placeholder="Your Name"
                        value={messageForm.senderName}
                        onChange={e => setMessageForm({ ...messageForm, senderName: e.target.value })}
                     />
                     <input
                        required
                        className="border rounded-lg p-3 bg-gray-50 md:col-span-1"
                        placeholder="Phone"
                        value={messageForm.phone}
                        onChange={e => setMessageForm({ ...messageForm, phone: e.target.value })}
                     />
                     <textarea
                        required
                        rows={3}
                        className="border rounded-lg p-3 bg-gray-50 md:col-span-3"
                        placeholder={`Message regarding ${selected?.name || 'branch'}...`}
                        value={messageForm.text}
                        onChange={e => setMessageForm({ ...messageForm, text: e.target.value })}
                     />
                     <div className="md:col-span-3 flex gap-2">
                        <Button type="submit" isLoading={msgLoading} className="gap-2"><Send className="w-4 h-4" /> Send</Button>
                        <Button type="button" variant="ghost" onClick={() => setShowMessage(false)}>Cancel</Button>
                     </div>
                  </form>
               </div>
            )}
         </Card>

         <div className="grid md:grid-cols-2 gap-6">
        {branches.map(branch => (
          <Card key={branch.id} className="p-0 overflow-hidden flex flex-col h-full border-0 shadow-xl">
             <div className="h-48 relative">
                <img 
                  src={branch.imageUrl} 
                  alt={branch.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                   <h2 className="text-2xl font-bold text-white">{branch.name}</h2>
                </div>
             </div>
             
             <div className="p-6 flex-1 flex flex-col">
                <div className="space-y-4 mb-6 flex-1">
                   <div className="flex gap-3">
                      <MapPin className="w-5 h-5 text-brand-600 flex-shrink-0 mt-1" />
                      <p className="text-gray-600">{branch.address}</p>
                   </div>
                   <div className="flex gap-3">
                      <Phone className="w-5 h-5 text-brand-600 flex-shrink-0 mt-1" />
                      <p className="text-gray-600">{branch.contactPhone}</p>
                   </div>
                   
                   <div className="border-t border-gray-100 pt-4">
                      <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                         <Clock className="w-4 h-4 text-brand-500" /> Service Times
                      </h4>
                      <div className="space-y-2">
                         {branch.serviceTimes.map((time, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-gray-50 p-2 rounded-lg text-sm">
                               <span className="font-semibold text-gray-700">{time.day}</span>
                               <div className="flex gap-2 text-right">
                                  <span className="text-brand-700 font-bold">{time.time}</span>
                                  <span className="text-gray-400 text-xs hidden sm:inline">• {time.label}</span>
                               </div>
                            </div>
                         ))}
                      </div>
                   </div>
                </div>

                <a 
                   href={branch.googleMapsUrl} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="w-full"
                >
                   <Button variant="outline" className="w-full gap-2 border-brand-200 text-brand-700 hover:bg-brand-50">
                      <Navigation className="w-4 h-4" /> Get Directions
                   </Button>
                </a>
             </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Locations;
