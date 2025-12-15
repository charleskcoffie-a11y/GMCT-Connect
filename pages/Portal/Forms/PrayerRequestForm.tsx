import React, { useState } from 'react';
import { AdminService } from '../../../services/api';
import { PageHeader, Card, Button } from '../../../components/UI';
import { useNavigate } from 'react-router-dom';
import { Lock, HeartHandshake, ArrowLeft } from 'lucide-react';

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
      
      // Simulate network delay for UX
      await new Promise(resolve => setTimeout(resolve, 800));
      
      await AdminService.submitPrayerRequest(formData);
      setLoading(false);
      
      // Success Feedback
      alert('Your prayer request has been submitted securely to the Minister.');
      navigate('/portal');
  };

  return (
    <div className="max-w-xl mx-auto">
       <div className="flex items-center gap-2 mb-4">
         <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-full text-white">
            <ArrowLeft className="w-5 h-5" />
         </button>
         <h1 className="text-2xl font-bold text-white">Prayer Request</h1>
       </div>
       
       <Card className="p-6 shadow-xl border-t-4 border-t-brand-500">
           <div className="flex items-center gap-4 mb-6 p-4 bg-brand-50 rounded-xl border border-brand-100">
              <div className="bg-brand-200 p-3 rounded-full text-brand-700">
                  <HeartHandshake className="w-6 h-6" />
              </div>
              <div>
                  <h3 className="font-bold text-brand-900">Pastoral Care</h3>
                  <p className="text-sm text-brand-700">Your request is confidential and goes directly to the Minister.</p>
              </div>
           </div>

           <form onSubmit={handleSubmit} className="space-y-5">
               <div>
                   <label className="block text-sm font-bold text-gray-700 mb-1">Your Name <span className="text-red-500">*</span></label>
                   <input 
                     required
                     type="text"
                     className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                     placeholder="e.g. Brother John / Sister Mary"
                     value={formData.requesterName}
                     onChange={e => setFormData({...formData, requesterName: e.target.value})}
                   />
               </div>

               <div>
                   <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number <span className="text-red-500">*</span></label>
                   <input 
                     required
                     type="tel"
                     className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                     placeholder="e.g. 024 123 4567"
                     value={formData.phone}
                     onChange={e => setFormData({...formData, phone: e.target.value})}
                   />
               </div>

               <div>
                   <label className="block text-sm font-bold text-gray-700 mb-1">Prayer Request <span className="text-red-500">*</span></label>
                   <textarea 
                     required
                     rows={5}
                     className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all resize-none"
                     placeholder="Please share your prayer topic or burden here..."
                     value={formData.content}
                     onChange={e => setFormData({...formData, content: e.target.value})}
                   />
               </div>

               <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                   <div className="flex items-center gap-3">
                       <div className="relative flex items-center">
                           <input 
                             type="checkbox" 
                             id="anon"
                             checked={formData.isAnonymous}
                             onChange={e => setFormData({...formData, isAnonymous: e.target.checked})}
                             className="w-5 h-5 text-brand-600 rounded border-gray-300 focus:ring-brand-500"
                           />
                       </div>
                       <label htmlFor="anon" className="cursor-pointer select-none">
                           <span className="block text-sm font-bold text-gray-800 flex items-center gap-1">
                               Keep Anonymous <Lock className="w-3 h-3 text-gray-500" />
                           </span>
                           <span className="block text-xs text-gray-500">Your name will be hidden in the prayer list.</span>
                       </label>
                   </div>
               </div>

               <Button type="submit" isLoading={loading} className="w-full py-3 text-lg font-bold shadow-lg hover:shadow-xl transform active:scale-[0.99] transition-all">
                   Submit Request
               </Button>
           </form>
       </Card>
    </div>
  );
};

export default PrayerRequestForm;