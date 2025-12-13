import React, { useState } from 'react';
import { AdminService } from '../../../services/api';
import { PageHeader, Card, Button } from '../../../components/UI';
import { useNavigate } from 'react-router-dom';
import { Send } from 'lucide-react';

const MessageMinisterForm: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
      senderName: '',
      phone: '',
      text: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      await AdminService.sendMessageToMinister(formData);
      setLoading(false);
      alert('Message sent to Minister.');
      navigate('/portal');
  };

  return (
    <div className="max-w-xl mx-auto">
       <PageHeader title="Message Minister" />
       
       <Card className="p-6">
           <p className="text-gray-500 text-sm mb-6">Send a direct message to the Rev. Minister. This message will appear in their private dashboard.</p>
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
                     placeholder="Write your message here..."
                     value={formData.text}
                     onChange={e => setFormData({...formData, text: e.target.value})}
                   />
               </div>

               <Button type="submit" isLoading={loading} className="w-full gap-2">
                   <Send className="w-4 h-4" /> Send Message
               </Button>
           </form>
       </Card>
    </div>
  );
};

export default MessageMinisterForm;