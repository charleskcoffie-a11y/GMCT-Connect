
import React, { useState, useEffect } from 'react';
import { AdminService } from '../../../services/api';
import { PrayerRequest, MinisterMessage, LeaderNote } from '../../../types';
import { PageHeader, LoadingScreen, Card, Badge, Button } from '../../../components/UI';
import { Mail, HeartHandshake, Check, CheckCircle, Lock, Phone, Calendar, Clock, ChevronDown, ClipboardList, User } from 'lucide-react';

const MinisterDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'prayers' | 'messages' | 'notes'>('prayers');
  const [prayers, setPrayers] = useState<PrayerRequest[]>([]);
  const [messages, setMessages] = useState<MinisterMessage[]>([]);
  const [notes, setNotes] = useState<LeaderNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    Promise.all([
        AdminService.getPrayerRequests(),
        AdminService.getMessages(),
        AdminService.getLeaderNotes()
    ]).then(([pData, mData, nData]) => {
        setPrayers(pData);
        setMessages(mData);
        setNotes(nData);
        setLoading(false);
    });
  }

  const handlePrayerStatus = async (id: string, status: PrayerRequest['status'], e?: React.MouseEvent) => {
     e?.stopPropagation();
     await AdminService.updatePrayerStatus(id, status);
     setPrayers(prayers.map(p => p.id === id ? { ...p, status } : p));
  };

  const handleMarkRead = async (id: string, type: 'message' | 'note') => {
      if (type === 'message') {
        await AdminService.markMessageRead(id);
        setMessages(messages.map(m => m.id === id ? { ...m, isRead: true } : m));
      } else {
        await AdminService.markLeaderNoteRead(id);
        setNotes(notes.map(n => n.id === id ? { ...n, isRead: true } : n));
      }
  };

  const toggleExpand = (id: string) => {
      setExpandedId(expandedId === id ? null : id);
  }

  if (loading) return <LoadingScreen />;

  return (
    <div>
      <PageHeader title="Pastoral Dashboard" />

      {/* Tabs */}
      <div className="flex border-b border-white/10 mb-6 overflow-x-auto no-scrollbar">
        <button 
          onClick={() => setActiveTab('prayers')}
          className={`px-6 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'prayers' ? 'border-brand-500 text-brand-400' : 'border-transparent text-gray-400 hover:text-white'}`}
        >
          <HeartHandshake className="w-4 h-4" /> Prayer Requests
          {prayers.filter(p => p.status === 'New').length > 0 && (
             <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{prayers.filter(p => p.status === 'New').length}</span>
          )}
        </button>
        <button 
          onClick={() => setActiveTab('messages')}
          className={`px-6 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'messages' ? 'border-brand-500 text-brand-400' : 'border-transparent text-gray-400 hover:text-white'}`}
        >
          <Mail className="w-4 h-4" /> Messages
          {messages.filter(m => !m.isRead).length > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{messages.filter(m => !m.isRead).length}</span>
          )}
        </button>
        <button 
          onClick={() => setActiveTab('notes')}
          className={`px-6 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'notes' ? 'border-brand-500 text-brand-400' : 'border-transparent text-gray-400 hover:text-white'}`}
        >
          <ClipboardList className="w-4 h-4" /> Class Notes
          {notes.filter(n => !n.isRead).length > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{notes.filter(n => !n.isRead).length}</span>
          )}
        </button>
      </div>

      {activeTab === 'prayers' && (
          <div className="space-y-4">
              {prayers.length === 0 && (
                  <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10">
                      <HeartHandshake className="w-12 h-12 text-white/20 mx-auto mb-3" />
                      <p className="text-gray-400">No prayer requests at this time.</p>
                  </div>
              )}
              {prayers.map(req => {
                  const isClosed = req.status === 'Closed';
                  const isExpanded = expandedId === req.id;
                  
                  return (
                    <Card 
                        key={req.id} 
                        className={`transition-all duration-300 border-l-[6px] cursor-pointer ${
                            isClosed 
                            ? 'border-l-gray-400 opacity-75 bg-gray-50' 
                            : 'border-l-rose-500 bg-white hover:shadow-lg'
                        }`}
                        onClick={() => toggleExpand(req.id)}
                    >
                        {/* Header Section */}
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-full ${isClosed ? 'bg-gray-200 text-gray-500' : 'bg-rose-50 text-rose-600'}`}>
                                        {req.isAnonymous ? <Lock className="w-5 h-5" /> : <HeartHandshake className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <h3 className={`font-bold text-lg leading-none ${isClosed ? 'text-gray-600' : 'text-gray-900'}`}>
                                            {req.isAnonymous ? 'Anonymous Request' : req.requesterName}
                                        </h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-gray-500 flex items-center gap-1">
                                                <Calendar className="w-3 h-3" /> {new Date(req.date).toLocaleDateString()}
                                            </span>
                                            <span className="text-xs text-gray-400">•</span>
                                            <span className="text-xs text-gray-500 flex items-center gap-1">
                                                <Clock className="w-3 h-3" /> {new Date(req.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <Badge color={req.status === 'New' ? 'red' : req.status === 'In-Progress' ? 'yellow' : 'gray'}>
                                        {req.status}
                                    </Badge>
                                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                </div>
                            </div>
                            
                            {/* Content Preview */}
                            <div className={`text-sm leading-relaxed ${isClosed ? 'text-gray-500' : 'text-gray-700'} ${isExpanded ? '' : 'line-clamp-2'}`}>
                                {req.content}
                            </div>
                        </div>

                        {/* Expanded Details */}
                        {isExpanded && (
                            <div className="px-5 pb-5 pt-0 animate-in fade-in slide-in-from-top-2">
                                <div className="mt-4 pt-4 border-t border-gray-100 grid md:grid-cols-2 gap-4">
                                    {!req.isAnonymous && (
                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <Phone className="w-4 h-4 text-gray-400" />
                                            <div>
                                                <span className="text-xs font-bold text-gray-400 block uppercase">Contact Phone</span>
                                                <a href={`tel:${req.phone}`} className="text-sm font-semibold text-brand-600 hover:underline" onClick={e => e.stopPropagation()}>
                                                    {req.phone}
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Actions Toolbar */}
                                {!isClosed && (
                                    <div className="mt-6 flex justify-end gap-3">
                                        {req.status === 'New' && (
                                            <Button 
                                                size="sm" 
                                                variant="outline" 
                                                className="border-yellow-200 bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                                                onClick={(e) => handlePrayerStatus(req.id, 'In-Progress', e)}
                                            >
                                                Mark In Progress
                                            </Button>
                                        )}
                                        <Button 
                                            size="sm" 
                                            className="bg-gray-800 text-white hover:bg-black gap-2"
                                            onClick={(e) => handlePrayerStatus(req.id, 'Closed', e)}
                                        >
                                            <CheckCircle className="w-4 h-4" /> Close Request
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}
                    </Card>
                  );
              })}
          </div>
      )}

      {activeTab === 'messages' && (
          <div className="space-y-4">
              {messages.length === 0 && (
                  <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10">
                      <Mail className="w-12 h-12 text-white/20 mx-auto mb-3" />
                      <p className="text-gray-400">No messages in inbox.</p>
                  </div>
              )}
              {messages.map(msg => (
                  <Card key={msg.id} className={`p-5 ${!msg.isRead ? 'bg-blue-50/50 border-blue-200' : 'bg-white'}`}>
                      <div className="flex justify-between items-start mb-2">
                          <div>
                              <h3 className={`font-bold ${!msg.isRead ? 'text-brand-900' : 'text-gray-800'}`}>{msg.senderName}</h3>
                              <p className="text-xs text-gray-500">{msg.phone}</p>
                          </div>
                          {!msg.isRead && <Badge color="red">New</Badge>}
                      </div>
                      <p className="text-gray-700 my-3 leading-relaxed">{msg.text}</p>
                      <div className="flex justify-between items-center mt-4 border-t border-gray-100 pt-3">
                          <span className="text-xs text-gray-400">{new Date(msg.date).toLocaleString()}</span>
                          {!msg.isRead ? (
                              <Button size="sm" variant="ghost" onClick={() => handleMarkRead(msg.id, 'message')} className="text-brand-600 gap-1 hover:bg-brand-50">
                                  <Check className="w-4 h-4" /> Mark as Read
                              </Button>
                          ) : (
                              <span className="text-xs text-green-600 flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Read</span>
                          )}
                      </div>
                  </Card>
              ))}
          </div>
      )}

      {activeTab === 'notes' && (
          <div className="space-y-4">
              {notes.length === 0 && (
                  <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10">
                      <ClipboardList className="w-12 h-12 text-white/20 mx-auto mb-3" />
                      <p className="text-gray-400">No class leader notes found.</p>
                  </div>
              )}
              {notes.map(note => (
                  <Card key={note.id} className={`p-5 ${!note.isRead ? 'bg-orange-50/50 border-orange-200' : 'bg-white'}`}>
                      <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-3">
                              <div className="p-2 bg-orange-100 rounded-lg text-orange-700">
                                  <User className="w-5 h-5" />
                              </div>
                              <div>
                                  <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide">Ref: {note.memberName}</h3>
                                  <p className="text-xs text-gray-500">From Leader {note.leaderName} (Class {note.classId})</p>
                              </div>
                          </div>
                          {!note.isRead && <Badge color="yellow">New</Badge>}
                      </div>
                      
                      <div className="bg-white/50 p-3 rounded-lg border border-orange-100/50 text-gray-800 text-sm leading-relaxed mb-3">
                          "{note.message}"
                      </div>

                      <div className="flex justify-between items-center pt-2">
                          <span className="text-xs text-gray-400">{new Date(note.createdAt).toLocaleString()}</span>
                          {!note.isRead ? (
                              <Button size="sm" variant="outline" onClick={() => handleMarkRead(note.id, 'note')} className="text-orange-600 border-orange-200 hover:bg-orange-50 gap-1">
                                  <Check className="w-4 h-4" /> Acknowledge
                              </Button>
                          ) : (
                            <span className="text-xs text-green-600 flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Acknowledged</span>
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
