import React, { useState, useEffect } from 'react';
import { AdminService } from '../../../services/api';
import { PrayerRequest, MinisterMessage } from '../../../types';
import { PageHeader, LoadingScreen, Card, Badge, Button } from '../../../components/UI';
import { Mail, HeartHandshake, Check, CheckCircle } from 'lucide-react';

const MinisterDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'prayers' | 'messages'>('prayers');
  const [prayers, setPrayers] = useState<PrayerRequest[]>([]);
  const [messages, setMessages] = useState<MinisterMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
        AdminService.getPrayerRequests(),
        AdminService.getMessages()
    ]).then(([pData, mData]) => {
        setPrayers(pData);
        setMessages(mData);
        setLoading(false);
    });
  }, []);

  const handlePrayerStatus = async (id: string, status: PrayerRequest['status']) => {
     await AdminService.updatePrayerStatus(id, status);
     setPrayers(prayers.map(p => p.id === id ? { ...p, status } : p));
  };

  const handleMarkRead = async (id: string) => {
      await AdminService.markMessageRead(id);
      setMessages(messages.map(m => m.id === id ? { ...m, isRead: true } : m));
  };

  if (loading) return <LoadingScreen />;

  return (
    <div>
      <PageHeader title="Pastoral Dashboard" />

      {/* Tabs - Using Brand Colors */}
      <div className="flex border-b border-app-border mb-6">
        <button 
          onClick={() => setActiveTab('prayers')}
          className={`px-6 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'prayers' ? 'border-brand-600 text-brand-600' : 'border-transparent text-app-subtext hover:text-brand-700'}`}
        >
          <HeartHandshake className="w-4 h-4" /> Prayer Requests
          <Badge color="blue">{prayers.filter(p => p.status === 'New').length}</Badge>
        </button>
        <button 
          onClick={() => setActiveTab('messages')}
          className={`px-6 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'messages' ? 'border-brand-600 text-brand-600' : 'border-transparent text-app-subtext hover:text-brand-700'}`}
        >
          <Mail className="w-4 h-4" /> Messages
          <Badge color="red">{messages.filter(m => !m.isRead).length}</Badge>
        </button>
      </div>

      {activeTab === 'prayers' && (
          <div className="space-y-4">
              {prayers.length === 0 && <p className="text-app-subtext text-center py-8">No prayer requests.</p>}
              {prayers.map(req => (
                  <Card key={req.id} className="p-5 border-l-4 border-l-brand-600">
                      <div className="flex justify-between items-start mb-2">
                          <div>
                              <h3 className="font-bold text-brand-900 dark:text-white">{req.isAnonymous ? 'Anonymous' : req.requesterName}</h3>
                              <p className="text-xs text-app-subtext">{req.phone}</p>
                          </div>
                          <Badge color={req.status === 'New' ? 'red' : req.status === 'In-Progress' ? 'yellow' : 'green'}>
                              {req.status}
                          </Badge>
                      </div>
                      <p className="text-app-text dark:text-gray-200 my-3 bg-brand-50 dark:bg-slate-800 p-3 rounded-lg">{req.content}</p>
                      <div className="text-xs text-gray-400 mb-4">{new Date(req.date).toLocaleString()}</div>
                      
                      {req.status !== 'Closed' && (
                          <div className="flex gap-2 border-t border-app-border pt-3">
                              {req.status === 'New' && (
                                  <Button size="sm" variant="outline" onClick={() => handlePrayerStatus(req.id, 'In-Progress')}>Mark In-Progress</Button>
                              )}
                              <Button size="sm" variant="outline" className="text-green-700" onClick={() => handlePrayerStatus(req.id, 'Closed')}>Close Request</Button>
                          </div>
                      )}
                  </Card>
              ))}
          </div>
      )}

      {activeTab === 'messages' && (
          <div className="space-y-4">
              {messages.length === 0 && <p className="text-app-subtext text-center py-8">No messages.</p>}
              {messages.map(msg => (
                  <Card key={msg.id} className={`p-5 ${!msg.isRead ? 'bg-brand-50/50 border-brand-200' : ''}`}>
                      <div className="flex justify-between items-start mb-2">
                          <div>
                              <h3 className={`font-bold ${!msg.isRead ? 'text-brand-900' : 'text-app-text'} dark:text-white`}>{msg.senderName}</h3>
                              <p className="text-xs text-app-subtext">{msg.phone}</p>
                          </div>
                          {!msg.isRead && <Badge color="red">New</Badge>}
                      </div>
                      <p className="text-app-text dark:text-gray-200 my-3">{msg.text}</p>
                      <div className="flex justify-between items-center mt-4">
                          <span className="text-xs text-gray-400">{new Date(msg.date).toLocaleString()}</span>
                          {!msg.isRead ? (
                              <Button size="sm" variant="ghost" onClick={() => handleMarkRead(msg.id)} className="text-brand-600 gap-1">
                                  <Check className="w-4 h-4" /> Mark Read
                              </Button>
                          ) : (
                              <span className="text-xs text-green-600 flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Read</span>
                          )}
                      </div>
                  </Card>
              ))}
          </div>
      )}
    </div>
  );
};

export default MinisterDashboard;