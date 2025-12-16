
import React, { useEffect, useState } from 'react';
import { ContentService } from '../services/api';
import { Organization } from '../types';
import { PageHeader, LoadingScreen, Card, Button } from '../components/UI';
import { Users, Phone, Clock, MessageSquare, Music, Star, HeartHandshake, Briefcase, Send } from 'lucide-react';
import { AdminService } from '../services/api';

const Organizations: React.FC = () => {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'All' | 'Men' | 'Women' | 'Youth' | 'Music' | 'Service'>('All');
  const [activeOrgId, setActiveOrgId] = useState<string | null>(null);
  const [recipient, setRecipient] = useState<'minister' | 'stewards'>('minister');
  const [msgLoading, setMsgLoading] = useState(false);
  const [messageForm, setMessageForm] = useState({ senderName: '', phone: '', text: '' });

  useEffect(() => {
    ContentService.getOrganizations().then(data => {
      setOrgs(data);
      setLoading(false);
    });
  }, []);

  const filteredOrgs = filter === 'All'
    ? orgs
    : orgs.filter(o => {
        if (filter === 'Youth') {
          return ['Children', 'MYF', 'AMB'].includes(o.category as any);
        }
        if (filter === 'Service') {
          return o.category === 'Service' || o.category === 'General';
        }
        return o.category === filter;
      });

  // Theme Helper
  const getTheme = (category: string) => {
      switch(category) {
          case 'Men': 
            return { 
                bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100', 
                iconBg: 'bg-blue-100', iconColor: 'text-blue-600', badge: 'bg-blue-100 text-blue-700' 
            };
          case 'Women': 
            return { 
                bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-100', 
                iconBg: 'bg-rose-100', iconColor: 'text-rose-600', badge: 'bg-rose-100 text-rose-700' 
            };
          case 'Youth': 
            return { 
                bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-100', 
                iconBg: 'bg-amber-100', iconColor: 'text-amber-600', badge: 'bg-amber-100 text-amber-800' 
            };
          case 'Children':
            return {
                bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-100',
                iconBg: 'bg-amber-100', iconColor: 'text-amber-600', badge: 'bg-amber-100 text-amber-800'
            };
          case 'MYF':
            return {
                bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-100',
                iconBg: 'bg-sky-100', iconColor: 'text-sky-600', badge: 'bg-sky-100 text-sky-700'
            };
          case 'AMB':
            return {
                bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-100',
                iconBg: 'bg-indigo-100', iconColor: 'text-indigo-600', badge: 'bg-indigo-100 text-indigo-700'
            };
          case 'Music': 
            return { 
                bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-100', 
                iconBg: 'bg-purple-100', iconColor: 'text-purple-600', badge: 'bg-purple-100 text-purple-700' 
            };
          default: 
            return { 
                bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100', 
                iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600', badge: 'bg-emerald-100 text-emerald-700' 
            };
      }
  };

    const getIcon = (category: string) => {
      switch(category) {
          case 'Men': return Users;
          case 'Women': return HeartHandshake;
        case 'Youth': return Star;
        case 'Children': return Star;
        case 'MYF': return Users;
        case 'AMB': return Briefcase;
          case 'Music': return Music;
          default: return Briefcase;
      }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div>
      <PageHeader title="Organizations & Ministries" />
      
      {/* Filter Tabs */}
      <div className="flex space-x-2 mb-8 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 no-scrollbar">
        {['All', 'Men', 'Women', 'Youth', 'Music', 'Service'].map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat as any)}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
              filter === cat 
                ? 'bg-brand-600 text-white shadow-md' 
                : 'bg-white/10 text-gray-300 border border-white/20 hover:bg-white/20'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrgs.map(org => {
              const theme = getTheme(org.category);
              const Icon = getIcon(org.category);

              return (
                <div key={org.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full group transform hover:-translate-y-1">
                    
                    {/* Header Section */}
                    <div className="p-6 pb-0">
                        <div className="flex justify-between items-start mb-4">
                             <div className={`w-12 h-12 rounded-2xl ${theme.iconBg} flex items-center justify-center ${theme.iconColor} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                                 <Icon className="w-6 h-6" />
                             </div>
                             <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border border-transparent ${theme.badge}`}>
                                {org.category}
                             </span>
                        </div>
                        <h3 className="text-xl font-extrabold text-gray-900 leading-tight mb-2 tracking-tight">{org.name}</h3>
                    </div>

                    {/* Content Section */}
                    <div className="p-6 space-y-4 flex-1">
                        
                        {/* Messaging Controls */}
                        <div className={`p-4 rounded-xl ${theme.bg} border ${theme.border} space-y-3`}>
                          <div className="flex items-center gap-3">
                            <div className="bg-white p-2.5 rounded-full shadow-sm">
                              <MessageSquare className={`w-4 h-4 ${theme.iconColor}`} />
                            </div>
                            <div className="min-w-0">
                              <span className={`text-[10px] font-extrabold uppercase block opacity-70 mb-0.5 ${theme.text}`}>Send Message</span>
                              <div className="text-xs text-gray-500">Choose recipient and write your message.</div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => setRecipient('minister')}
                              className={`px-3 py-2 text-xs font-bold rounded-lg border ${recipient === 'minister' ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-gray-700 border-gray-200'}`}
                            >
                              Rev. Minister
                            </button>
                            <button
                              type="button"
                              onClick={() => setRecipient('stewards')}
                              className={`px-3 py-2 text-xs font-bold rounded-lg border ${recipient === 'stewards' ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-700 border-gray-200'}`}
                            >
                              Society Stewards
                            </button>
                          </div>

                          <div className="space-y-2">
                            <input
                              className="w-full border rounded-lg p-2 text-sm"
                              placeholder="Your Name"
                              value={messageForm.senderName}
                              onChange={e => setMessageForm({ ...messageForm, senderName: e.target.value })}
                            />
                            <input
                              className="w-full border rounded-lg p-2 text-sm"
                              placeholder="Phone"
                              value={messageForm.phone}
                              onChange={e => setMessageForm({ ...messageForm, phone: e.target.value })}
                            />
                            <textarea
                              className="w-full border rounded-lg p-2 text-sm"
                              rows={3}
                              placeholder={`Message regarding ${org.name}...`}
                              value={messageForm.text}
                              onChange={e => setMessageForm({ ...messageForm, text: e.target.value })}
                            />

                            <div className="flex gap-2">
                              <Button
                                className="gap-2"
                                isLoading={msgLoading && activeOrgId === org.id}
                                onClick={async () => {
                                  setActiveOrgId(org.id);
                                  setMsgLoading(true);
                                  try {
                                    if (recipient === 'minister') {
                                      await AdminService.sendMessageToMinister({ ...messageForm });
                                    } else {
                                      await AdminService.sendMessageToStewards({ ...messageForm });
                                    }
                                    alert('Message sent.');
                                    setMessageForm({ senderName: '', phone: '', text: '' });
                                  } finally {
                                    setMsgLoading(false);
                                    setActiveOrgId(null);
                                  }
                                }}
                              >
                                <Send className="w-4 h-4" /> Send
                              </Button>
                              <Button
                                variant="ghost"
                                onClick={() => setMessageForm({ senderName: '', phone: '', text: '' })}
                              >
                                Clear
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Aims & Objectives */}
                        <div className="mt-4 p-4 rounded-xl bg-gray-50 border border-gray-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Briefcase className="w-4 h-4 text-gray-500" />
                            <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">Aims & Objectives</span>
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed">{org.description}</p>
                        </div>

                        {/* Meeting time intentionally hidden per request */}
                    </div>

                    {/* Updates Footer (Conditional) */}
                    {org.announcements.length > 0 && (
                        <div className="bg-gray-50/80 p-4 border-t border-gray-100">
                            <div className="flex items-center gap-2 mb-2">
                                <MessageSquare className="w-3.5 h-3.5 text-gray-400" />
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Recent Updates</span>
                            </div>
                             <ul className="space-y-2">
                                {org.announcements.slice(0, 2).map((ann, i) => (
                                    <li key={i} className="text-xs text-gray-600 flex items-start gap-2 leading-snug">
                                        <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${theme.iconColor.replace('text-', 'bg-')}`}></span>
                                        <span className="flex-1 opacity-90">{ann}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
              );
          })}
          
          {filteredOrgs.length === 0 && (
              <div className="col-span-full text-center py-20">
                  <div className="bg-white/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
                      <Users className="w-10 h-10 text-white/40" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">No Ministries Found</h3>
                  <p className="text-white/60 font-medium">Try selecting a different category.</p>
              </div>
          )}
      </div>
    </div>
  );
};

export default Organizations;
