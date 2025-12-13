import React, { useState } from 'react';
import { AdminService } from '../../../services/api';
import { PageHeader, Card, Button } from '../../../components/UI';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';

const PrayerRequestForm: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
      requesterName: '',
      phone: '',
      content: '',
      isAnonymous: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      await AdminService.submitPrayerRequest(formData);
      setLoading(false);
      alert('Prayer request submitted securely.');
      navigate('/portal');
  };

  return (
    <div className="max-w-xl mx-auto">
       <PageHeader title="Submit Prayer Request" />
       
       <Card className="p-6">
           <form onSubmit={handleSubmit} className="space-y-4">
               <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                   <input 
                     required
                     type="text"
                     className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-brand-500 outline-none"
                     placeholder="Brother John"
                     value={formData.requesterName}
                     onChange={e => setFormData({...formData, requesterName: e.target.value})}
                   />
               </div>

               <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                   <input 
                     required
                     type="tel"
                     className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-brand-500 outline-none"
                     placeholder="024..."
                     value={formData.phone}
                     onChange={e => setFormData({...formData, phone: e.target.value})}
                   />
               </div>

               <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Prayer Request</label>
                   <textarea 
                     required
                     rows={5}
                     className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-brand-500 outline-none"
                     placeholder="Please share your prayer topic..."
                     value={formData.content}
                     onChange={e => setFormData({...formData, content: e.target.value})}
                   />
               </div>

               <div className="flex items-center gap-2 py-2">
                   <input 
                     type="checkbox" 
                     id="anon"
                     checked={formData.isAnonymous}
                     onChange={e => setFormData({...formData, isAnonymous: e.target.checked})}
                     className="w-4 h-4 text-brand-600 rounded"
                   />
                   <label htmlFor="anon" className="text-sm text-gray-700 flex items-center gap-1">
                       Keep Anonymous <Lock className="w-3 h-3 text-gray-400" />
                   </label>
               </div>

               <Button type="submit" isLoading={loading} className="w-full">Submit Request</Button>
           </form>
       </Card>
    </div>
  );
};

export default PrayerRequestForm;