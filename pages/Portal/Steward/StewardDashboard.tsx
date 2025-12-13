import React, { useEffect, useState } from 'react';
import { ContentService } from '../../../services/api';
import { Announcement, Event } from '../../../types';
import { PageHeader, Card, Badge, LoadingScreen, Button } from '../../../components/UI';
import { AlertCircle, Calendar, Mic2, Plus, Bell, Trash2, Send } from 'lucide-react';

const StewardDashboard: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
      title: '',
      content: '',
      category: 'General' as 'General' | 'Audio' | 'Video',
      notify: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadData();
    // Request notification permission on mount if not already granted
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
  }, []);

  const loadData = () => {
    Promise.all([
        ContentService.getAnnouncements(),
        ContentService.getEvents()
    ]).then(([a, e]) => {
        setAnnouncements(a);
        setEvents(e);
        setLoading(false);
    });
  };

  const handleCreate = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);

      // 1. Create Data
      await ContentService.createAnnouncement({
          title: formData.title,
          content: formData.content,
          category: formData.category,
          isFeatured: false
      });

      // 2. Handle Push Notification
      if (formData.notify) {
          sendPushNotification(formData.title, formData.content);
      }

      // 3. Reset UI
      setFormData({ title: '', content: '', category: 'General', notify: false });
      setShowForm(false);
      setIsSubmitting(false);
      loadData(); // Refresh list
  };

  const handleDelete = async (id: string) => {
      if(window.confirm('Are you sure you want to remove this announcement?')) {
          await ContentService.deleteAnnouncement(id);
          loadData();
      }
  };

  const sendPushNotification = (title: string, body: string) => {
      // In a real app, this would trigger a backend function.
      // Here we use the browser's local Notification API to simulate the result.
      if (!('Notification' in window)) {
          alert('This browser does not support desktop notifications');
      } else if (Notification.permission === 'granted') {
          new Notification(`📢 New Church Announcement`, {
              body: `${title}: ${body}`,
              icon: '/favicon.ico'
          });
      } else if (Notification.permission !== 'denied') {
          Notification.requestPermission().then(permission => {
              if (permission === 'granted') {
                  new Notification(`📢 New Church Announcement`, {
                    body: `${title}: ${body}`
                  });
              }
          });
      } else {
          alert("Notification sent! (Permissions required to see preview)");
      }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div>
      <PageHeader title="Steward Dashboard" />
      
      {/* Overview Stats */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
         <Card className="p-4 bg-purple-50 border-purple-100 flex items-center gap-4">
             <div className="p-3 bg-purple-200 text-purple-700 rounded-lg">
                 <Mic2 className="w-6 h-6" />
             </div>
             <div>
                 <span className="block text-2xl font-bold text-purple-900">{announcements.length}</span>
                 <span className="text-xs text-purple-700 font-bold uppercase">Active Announcements</span>
             </div>
         </Card>
         
         <Card className="p-4 bg-orange-50 border-orange-100 flex items-center gap-4">
             <div className="p-3 bg-orange-200 text-orange-700 rounded-lg">
                 <Calendar className="w-6 h-6" />
             </div>
             <div>
                 <span className="block text-2xl font-bold text-orange-900">{events.length}</span>
                 <span className="text-xs text-orange-700 font-bold uppercase">Upcoming Events</span>
             </div>
         </Card>
      </div>

      {/* Action Section */}
      <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900">Announcement Management</h3>
              {!showForm && (
                  <Button onClick={() => setShowForm(true)} className="gap-2 shadow-md">
                      <Plus className="w-4 h-4" /> Post Announcement
                  </Button>
              )}
          </div>

          {showForm && (
              <Card className="p-6 border-brand-200 bg-white shadow-lg mb-6 animate-in fade-in slide-in-from-top-4">
                  <h4 className="font-bold text-lg mb-4 text-gray-800">New Announcement</h4>
                  <form onSubmit={handleCreate} className="space-y-4">
                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                          <input 
                              required
                              type="text"
                              className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-brand-500 outline-none"
                              placeholder="e.g. Mid-Year Harvest Update"
                              value={formData.title}
                              onChange={e => setFormData({...formData, title: e.target.value})}
                          />
                      </div>
                      
                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                          <textarea 
                              required
                              rows={3}
                              className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-brand-500 outline-none"
                              placeholder="Details of the announcement..."
                              value={formData.content}
                              onChange={e => setFormData({...formData, content: e.target.value})}
                          />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                              <select 
                                  className="w-full border rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-brand-500 outline-none"
                                  value={formData.category}
                                  onChange={e => setFormData({...formData, category: e.target.value as any})}
                              >
                                  <option value="General">General</option>
                                  <option value="Audio">Audio</option>
                                  <option value="Video">Video</option>
                              </select>
                          </div>
                          
                          <div className="flex items-center h-full pt-6">
                              <label className="flex items-center gap-3 cursor-pointer group">
                                  <div className="relative">
                                      <input 
                                          type="checkbox" 
                                          className="sr-only peer"
                                          checked={formData.notify}
                                          onChange={e => setFormData({...formData, notify: e.target.checked})}
                                      />
                                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                                  </div>
                                  <div className="flex flex-col">
                                      <span className="text-sm font-medium text-gray-900 flex items-center gap-1">
                                          Push Notification <Bell className="w-3 h-3 text-red-500" />
                                      </span>
                                      <span className="text-xs text-gray-500">Notify all members immediately</span>
                                  </div>
                              </label>
                          </div>
                      </div>

                      <div className="flex justify-end gap-3 pt-2 border-t mt-2">
                          <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
                          <Button type="submit" isLoading={isSubmitting} className="gap-2">
                              {formData.notify ? <Send className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                              {formData.notify ? 'Post & Notify' : 'Post Announcement'}
                          </Button>
                      </div>
                  </form>
              </Card>
          )}

          {/* List of Announcements */}
          <div className="space-y-3">
              {announcements.length === 0 && <p className="text-gray-500 italic">No announcements posted yet.</p>}
              {announcements.map(ann => (
                  <div key={ann.id} className="bg-white border border-gray-200 rounded-lg p-4 flex justify-between items-start group hover:border-brand-300 transition-colors">
                      <div>
                          <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-bold text-gray-900">{ann.title}</h4>
                              <Badge color={ann.category === 'General' ? 'gray' : 'blue'}>{ann.category}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-1">{ann.content}</p>
                          <span className="text-xs text-gray-400 mt-1 block">{new Date(ann.date).toLocaleDateString()}</span>
                      </div>
                      <button 
                          onClick={() => handleDelete(ann.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                          title="Delete Announcement"
                      >
                          <Trash2 className="w-4 h-4" />
                      </button>
                  </div>
              ))}
          </div>
      </div>
    </div>
  );
};

export default StewardDashboard;