
import React, { useState } from 'react';
import { PageHeader, Card, Button } from '../components/UI';
import { OutreachService } from '../services/api';
import { Heart, Clock, MapPin, Smile, ArrowRight, Calendar } from 'lucide-react';

const NewHere: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    visitDate: '',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await OutreachService.submitVisitorForm(formData);
    setSubmitting(false);
    alert("We're excited to see you! A member of our team will be in touch shortly.");
    setFormData({ name: '', email: '', phone: '', visitDate: '', notes: '' });
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="relative rounded-2xl overflow-hidden h-64 md:h-80 shadow-2xl">
        <img 
          src="https://picsum.photos/seed/gmct_welcome/1200/600" 
          alt="Welcome to GMCT" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-900/90 to-transparent flex items-end p-6 md:p-10">
          <div>
            <span className="bg-brand-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3 inline-block">
              New Here?
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 leading-tight">
              Welcome Home
            </h1>
            <p className="text-white/80 md:text-lg max-w-2xl">
              We are a community of faith, hope, and love. No matter where you are in your journey, you belong here.
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Main Content Column */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Welcome Message */}
          <Card className="p-8">
            <div className="flex gap-4 items-start mb-6">
              <div className="w-16 h-16 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden border-2 border-brand-100">
                 <img src="https://ui-avatars.com/api/?name=Rev+Minister&background=1F4FD8&color=fff" alt="Pastor" className="w-full h-full object-cover" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Welcome to GMCT</h2>
                <p className="text-brand-600 font-medium">From the Leadership of GMCT</p>
              </div>
            </div>
            <div className="prose prose-slate max-w-none text-gray-600 leading-relaxed">
              <p>
                "Hello and welcome! It is a joy to have you connect with us. At GMCT, we believe that church is more than a building; it's a family. Our mission is to walk in the Word and be equipped for every good work."
              </p>
              <p>
                "Whether you are visiting for the first time or looking for a new church home, we want you to feel comfortable and welcomed. Join us this Sunday and experience the warmth of our fellowship."
              </p>
            </div>
          </Card>

          {/* Service Times & Location */}
          <Card className="p-0 overflow-hidden">
             <div className="bg-brand-50 p-6 border-b border-brand-100">
                <h3 className="font-bold text-xl text-brand-900 flex items-center gap-2">
                   <Clock className="w-5 h-5 text-brand-600" /> Service Times & Directions
                </h3>
             </div>
             <div className="p-6 grid md:grid-cols-2 gap-8">
                {/* Times */}
                <div>
                   <h4 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">Weekly Schedule</h4>
                   <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-white border border-gray-100 rounded-lg shadow-sm">
                         <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-50 text-red-600 rounded-lg"><Calendar className="w-4 h-4" /></div>
                            <span className="font-semibold text-gray-800">Sunday Service</span>
                         </div>
                         <span className="font-bold text-gray-900">10:00 AM - 1:00 PM</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white border border-gray-100 rounded-lg shadow-sm">
                         <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Calendar className="w-4 h-4" /></div>
                            <span className="font-semibold text-gray-800">Bible Studies (Tue, Zoom)</span>
                         </div>
                         <span className="font-bold text-gray-900">8:00 PM</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white border border-gray-100 rounded-lg shadow-sm">
                         <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Calendar className="w-4 h-4" /></div>
                            <span className="font-semibold text-gray-800">Prayer (Fri)</span>
                         </div>
                         <span className="font-bold text-gray-900">8:00 PM - 9:30 PM</span>
                      </div>
                   </div>
                </div>

                {/* Address & Map */}
                <div>
                   <h4 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">Location</h4>
                   <div className="flex items-start gap-3 mb-4">
                      <MapPin className="w-5 h-5 text-brand-600 mt-1 flex-shrink-0" />
                      <div>
                         <p className="font-semibold text-gray-900">GMCT Main Sanctuary</p>
                         <p className="text-gray-600 text-sm">69 Milvan Drive, North York, Ontario, Canada</p>
                      </div>
                   </div>
                   
                   <div className="w-full h-32 bg-gray-200 rounded-lg overflow-hidden relative shadow-inner border border-gray-200">
                      <iframe 
                        width="100%" 
                        height="100%" 
                        frameBorder="0" 
                        scrolling="no" 
                        title="Church Location"
                        src="https://maps.google.com/maps?q=69+Milvan+Drive,North+York,Ontario,Canada&t=&z=14&ie=UTF8&iwloc=&output=embed"
                        className="opacity-80 hover:opacity-100 transition-opacity"
                        style={{ border: 0 }}
                      ></iframe>
                   </div>
                   <a 
                      href="https://maps.google.com/?q=69+Milvan+Drive,North+York,Ontario,Canada" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block mt-3"
                   >
                      <Button variant="outline" className="w-full text-xs">
                          Open in Google Maps
                      </Button>
                   </a>
                </div>
             </div>
          </Card>

          {/* What to Expect */}
          <Card className="p-6 bg-white border border-gray-100">
             <h3 className="font-bold text-xl text-gray-900 mb-4 flex items-center gap-2">
               <Smile className="w-6 h-6 text-brand-600" /> What to Expect
             </h3>
             <div className="grid md:grid-cols-2 gap-6">
                <div className="flex gap-3">
                   <Clock className="w-5 h-5 text-brand-500 flex-shrink-0" />
                   <div>
                      <h4 className="font-bold text-gray-900 text-sm">Service Duration</h4>
                      <p className="text-sm text-gray-600">Our services typically last about two and a half hours (2½ hours), filled with worship, prayer, and teaching.</p>
                   </div>
                </div>
                <div className="flex gap-3">
                   <Heart className="w-5 h-5 text-brand-500 flex-shrink-0" />
                   <div>
                      <h4 className="font-bold text-gray-900 text-sm">Come as You Are</h4>
                      <p className="text-sm text-gray-600">From suits to jeans, we care more about you than what you wear.</p>
                   </div>
                </div>
                <div className="flex gap-3">
                   <MapPin className="w-5 h-5 text-brand-500 flex-shrink-0" />
                   <div>
                      <h4 className="font-bold text-gray-900 text-sm">Kids Ministry</h4>
                      <p className="text-sm text-gray-600">We have a safe and fun Sunday School program for children of all ages.</p>
                   </div>
                </div>
             </div>
          </Card>
        </div>

        {/* Visitor Form */}
        <div className="md:col-span-1">
          <Card className="p-6 sticky top-6 border-t-4 border-t-brand-500 shadow-xl">
             <h3 className="text-xl font-bold text-gray-900 mb-2">Plan Your Visit</h3>
             <p className="text-sm text-gray-500 mb-6">Let us know you're coming and we'll save you a seat!</p>
             
             <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                   <label className="text-xs font-bold text-gray-700 uppercase">Your Name</label>
                   <input 
                      required
                      className="w-full border rounded-lg p-3 text-sm mt-1 focus:ring-2 focus:ring-brand-500 outline-none"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                   />
                </div>
                <div>
                   <label className="text-xs font-bold text-gray-700 uppercase">Email Address</label>
                   <input 
                      required
                      type="email"
                      className="w-full border rounded-lg p-3 text-sm mt-1 focus:ring-2 focus:ring-brand-500 outline-none"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                   />
                </div>
                <div>
                   <label className="text-xs font-bold text-gray-700 uppercase">Phone (Optional)</label>
                   <input 
                      type="tel"
                      className="w-full border rounded-lg p-3 text-sm mt-1 focus:ring-2 focus:ring-brand-500 outline-none"
                      placeholder="(555) 123-4567"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                   />
                </div>
                <div>
                   <label className="text-xs font-bold text-gray-700 uppercase">Planned Visit Date</label>
                   <input 
                      required
                      type="date"
                      className="w-full border rounded-lg p-3 text-sm mt-1 focus:ring-2 focus:ring-brand-500 outline-none"
                      value={formData.visitDate}
                      onChange={e => setFormData({...formData, visitDate: e.target.value})}
                   />
                </div>
                <div>
                   <label className="text-xs font-bold text-gray-700 uppercase">Any questions or kids?</label>
                   <textarea 
                      className="w-full border rounded-lg p-3 text-sm mt-1 focus:ring-2 focus:ring-brand-500 outline-none h-24"
                      placeholder="I'm bringing 2 kids..."
                      value={formData.notes}
                      onChange={e => setFormData({...formData, notes: e.target.value})}
                   />
                </div>
                
                <Button type="submit" isLoading={submitting} className="w-full shadow-lg gap-2">
                   I'm Coming! <ArrowRight className="w-4 h-4" />
                </Button>
             </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NewHere;
