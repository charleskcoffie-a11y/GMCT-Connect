
import React, { useState } from 'react';
import { ClassService } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import { PageHeader, Card, Button } from '../../../components/UI';
import { useNavigate } from 'react-router-dom';
import { Send, Users } from 'lucide-react';

const MessageLeaderForm: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
      senderName: user?.name || '',
      phone: user?.phoneNumber || '',
      message: '',
  });

  if (!user || !user.classId) {
      return (
          <div className="p-8 text-center">
              <p>You must be assigned to a class to use this feature.</p>
              <Button onClick={() => navigate('/portal')}>Go Back</Button>
          </div>
      );
  }

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      if (user.classId) {
        await ClassService.sendMessageToLeader({
            senderName: formData.senderName,
            senderPhone: formData.phone,
            classId: user.classId,
            message: formData.message,
        });
        setLoading(false);
        alert(`Message sent to ${user.className} Leader.`);
        navigate('/portal');
      }
  };

  return (
    <div className="max-w-xl mx-auto">
       <PageHeader title="Message Class Leader" />
       
       <Card className="p-6">
           <div className="flex items-center gap-3 mb-6 bg-blue-50 p-4 rounded-xl border border-blue-100">
               <div className="p-2 bg-blue-200 rounded-full text-blue-700">
                   <Users className="w-5 h-5" />
               </div>
               <div>
                   <h3 className="font-bold text-blue-900">{user.className}</h3>
                   <p className="text-sm text-blue-700">Sending to your Class Leader</p>
               </div>
           </div>

           <form onSubmit={handleSubmit} className="space-y-4">
               <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                   <input 
                     required
                     type="text"
                     className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-brand-500 outline-none"
                     value={formData.senderName}
                     onChange={e => setFormData({...formData, senderName: e.target.value})}
                   />
               </div>

               <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                   <input 
                     required
                     type="tel"
                     className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-brand-500 outline-none"
                     value={formData.phone}
                     onChange={e => setFormData({...formData, phone: e.target.value})}
                   />
               </div>

               <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                   <textarea 
                     required
                     rows={5}
                     className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-brand-500 outline-none"
                     placeholder="Reason for absence, update, or question..."
                     value={formData.message}
                     onChange={e => setFormData({...formData, message: e.target.value})}
                   />
               </div>

               <Button type="submit" isLoading={loading} className="w-full gap-2">
                   <Send className="w-4 h-4" /> Send to Class Leader
               </Button>
           </form>
       </Card>
    </div>
  );
};

export default MessageLeaderForm;
