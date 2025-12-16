
import React, { useState } from 'react';
import { PageHeader, Card, Button } from '../components/UI';
import { OutreachService } from '../services/api';
import { Mail, Phone, MapPin, Send, Globe } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await OutreachService.submitContactForm(formData);
    setSubmitting(false);
    alert("Message sent! We'll get back to you soon.");
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div>
      <PageHeader title="Contact Us" />

      <div className="grid md:grid-cols-2 gap-8">
         <div className="space-y-6">
            <Card className="p-6 bg-brand-600 text-white border-none shadow-xl">
               <h3 className="text-xl font-bold mb-4">Get in Touch</h3>
               <p className="text-brand-100 mb-8">
                  Have questions about our services, ministries, or events? We'd love to hear from you.
               </p>
               
               <div className="space-y-6">
                  <div className="flex items-start gap-4">
                     <div className="p-2 bg-white/10 rounded-lg">
                        <Phone className="w-6 h-6 text-brand-200" />
                     </div>
                     <div>
                           <p className="text-xs font-bold text-brand-300 uppercase">Phone</p>
                           <p className="font-semibold text-lg">416 743 4555</p>
                     </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                     <div className="p-2 bg-white/10 rounded-lg">
                        <Mail className="w-6 h-6 text-brand-200" />
                     </div>
                     <div>
                        <p className="text-xs font-bold text-brand-300 uppercase">Email</p>
                        <p className="font-semibold text-lg">info@gmct-ca.org</p>
                     </div>
                  </div>

                  <div className="flex items-start gap-4">
                     <div className="p-2 bg-white/10 rounded-lg">
                        <Globe className="w-6 h-6 text-brand-200" />
                     </div>
                     <div>
                        <p className="text-xs font-bold text-brand-300 uppercase">Website</p>
                        <p className="font-semibold text-lg">
                          <a href="https://www.gmct-ca.org" target="_blank" rel="noopener noreferrer">www.gmct-ca.org</a>
                        </p>
                     </div>
                  </div>

                  <div className="flex items-start gap-4">
                     <div className="p-2 bg-white/10 rounded-lg">
                        <MapPin className="w-6 h-6 text-brand-200" />
                     </div>
                     <div>
                           <p className="text-xs font-bold text-brand-300 uppercase">Office Address</p>
                           <p className="font-semibold text-lg">69 Milvan Drive<br/>North York, Ontario, Canada</p>
                     </div>
                  </div>
               </div>
            </Card>

            <Card className="p-6">
              <h4 className="font-bold text-gray-900 mb-4">Follow Us</h4>
              <div className="space-y-3">
                <a
                  href="https://www.youtube.com/@GMCT"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg bg-red-50 hover:bg-red-100 border border-red-100 transition-colors"
                >
                  <span className="font-bold text-red-700">▶</span>
                  <div>
                    <p className="text-xs font-bold text-red-600 uppercase">YouTube</p>
                    <p className="text-sm text-red-700 font-medium">GMCT</p>
                  </div>
                </a>
                <a
                  href="https://www.facebook.com/GMCT"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-100 transition-colors"
                >
                  <span className="font-bold text-blue-700">f</span>
                  <div>
                    <p className="text-xs font-bold text-blue-600 uppercase">Facebook</p>
                    <p className="text-sm text-blue-700 font-medium">GMCT</p>
                  </div>
                </a>
                <a
                  href="https://www.tiktok.com/@GMCT"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg bg-black/5 hover:bg-black/10 border border-gray-200 transition-colors"
                >
                  <span className="font-bold text-gray-900">♪</span>
                  <div>
                    <p className="text-xs font-bold text-gray-600 uppercase">TikTok</p>
                    <p className="text-sm text-gray-900 font-medium">GMCT</p>
                  </div>
                </a>
              </div>
            </Card>
            
            <Card className="p-6">
                <h4 className="font-bold text-gray-900 mb-2">Office Hours</h4>
               <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                     <span>Monday - Friday</span>
                     <span className="font-bold">9:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                     <span>Saturday & Sunday</span>
                     <span className="font-bold">Closed (Services Only)</span>
                  </div>
               </div>
            </Card>
         </div>

         <Card className="p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Send a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-5">
               <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Your Name</label>
                  <input 
                     required
                     className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-brand-500 outline-none bg-gray-50 focus:bg-white transition-colors"
                     value={formData.name}
                     onChange={e => setFormData({...formData, name: e.target.value})}
                  />
               </div>
               <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
                  <input 
                     required
                     type="email"
                     className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-brand-500 outline-none bg-gray-50 focus:bg-white transition-colors"
                     value={formData.email}
                     onChange={e => setFormData({...formData, email: e.target.value})}
                  />
               </div>
               <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Message</label>
                  <textarea 
                     required
                     rows={5}
                     className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-brand-500 outline-none bg-gray-50 focus:bg-white transition-colors"
                     value={formData.message}
                     onChange={e => setFormData({...formData, message: e.target.value})}
                  />
               </div>
               
               <Button type="submit" isLoading={submitting} className="w-full shadow-lg gap-2">
                  <Send className="w-4 h-4" /> Send Message
               </Button>
            </form>
         </Card>
           <Card className="p-6">
              <h4 className="font-bold text-gray-900 mb-3">Society Stewards</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                 <li>Bro Agyen Frimpong</li>
                 <li>Bro James Baah</li>
                 <li>Sis Henrietta Birago</li>
              </ul>
           </Card>
      </div>
    </div>
  );
};

export default Contact;
