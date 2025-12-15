
import React, { useEffect, useState } from 'react';
import { ContentService } from '../../../services/api';
import { Announcement, Event } from '../../../types';
import { PageHeader, Card, Badge, LoadingScreen, Button } from '../../../components/UI';
import { Calendar, Mic2, Plus, Bell, Trash2, Send, FileText, Play, Music, UploadCloud, Video, Image as ImageIcon, X } from 'lucide-react';

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
      startDate: new Date().toISOString().split('T')[0] + 'T00:00',
      endDate: '',
      notify: false
  });
  
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Set default end date to 7 days from now
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    setFormData(prev => ({ ...prev, endDate: nextWeek.toISOString().split('T')[0] + 'T23:59' }));
    
    loadData();
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          setUploadedFile(file);
          setPreviewUrl(URL.createObjectURL(file));
      }
  };

  const removeFile = () => {
      setUploadedFile(null);
      setPreviewUrl(null);
  };

  const handleCreate = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);

      // In a real app, you would upload the file to Firebase Storage here and get the URL
      // For mock purposes, we use the preview URL or a placeholder if available
      let mediaUrl = previewUrl;
      let imageUrl = undefined;
      
      // If General (Text), we treat file as image cover. If Audio/Video, it's the media content.
      if (formData.category === 'General' && previewUrl) {
          imageUrl = previewUrl;
          mediaUrl = undefined;
      }

      await ContentService.createAnnouncement({
          title: formData.title,
          content: formData.content,
          category: formData.category,
          isFeatured: false,
          startDate: formData.startDate,
          endDate: formData.endDate,
          mediaUrl: mediaUrl || undefined,
          imageUrl: imageUrl
      });

      if (formData.notify) {
          sendPushNotification(formData.title, formData.content);
      }

      // Reset
      setFormData({
          title: '',
          content: '',
          category: 'General',
          startDate: new Date().toISOString().split('T')[0] + 'T00:00',
          endDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0] + 'T23:59',
          notify: false
      });
      removeFile();
      setShowForm(false);
      setIsSubmitting(false);
      loadData();
  };

  const handleDelete = async (id: string) => {
      if(window.confirm('Are you sure you want to remove this announcement?')) {
          await ContentService.deleteAnnouncement(id);
          loadData();
      }
  };

  const sendPushNotification = (title: string, body: string) => {
      if (!('Notification' in window)) {
          alert('This browser does not support desktop notifications');
      } else if (Notification.permission === 'granted') {
          new Notification(`📢 New Church Announcement`, {
              body: `${title}: ${body}`,
              icon: '/favicon.ico'
          });
      }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div>
      <PageHeader title="Steward Dashboard" />
      
      {/* Action Section */}
      <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900 dark:text-white">Announcement Management</h3>
              {!showForm && (
                  <Button onClick={() => setShowForm(true)} className="gap-2 shadow-md">
                      <Plus className="w-4 h-4" /> New Announcement
                  </Button>
              )}
          </div>

          {showForm && (
              <Card className="p-0 border-brand-200 bg-white dark:bg-slate-900 shadow-xl mb-6 animate-in fade-in slide-in-from-top-4 overflow-hidden">
                  <div className="bg-gray-50 dark:bg-slate-800 border-b border-gray-100 dark:border-gray-700 p-4 flex justify-between items-center">
                      <h4 className="font-bold text-lg text-gray-800 dark:text-white">Compose Announcement</h4>
                      <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5"/></button>
                  </div>
                  
                  <form onSubmit={handleCreate} className="p-6 space-y-6">
                      
                      {/* 1. Media Type Selection */}
                      <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Announcement Type</label>
                          <div className="grid grid-cols-3 gap-3">
                              {(['General', 'Audio', 'Video'] as const).map((cat) => (
                                  <button
                                      key={cat}
                                      type="button"
                                      onClick={() => { setFormData({...formData, category: cat}); removeFile(); }}
                                      className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                                          formData.category === cat 
                                          ? 'border-brand-500 bg-brand-50 text-brand-700' 
                                          : 'border-gray-100 bg-white hover:bg-gray-50 text-gray-600'
                                      }`}
                                  >
                                      {cat === 'General' && <FileText className="w-6 h-6 mb-1" />}
                                      {cat === 'Audio' && <Music className="w-6 h-6 mb-1" />}
                                      {cat === 'Video' && <Video className="w-6 h-6 mb-1" />}
                                      <span className="text-xs font-bold">{cat}</span>
                                  </button>
                              ))}
                          </div>
                      </div>

                      {/* 2. Content Details */}
                      <div className="space-y-4">
                          <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                              <input 
                                  required
                                  type="text"
                                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-brand-500 outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                                  placeholder="e.g. Mid-Year Harvest Update"
                                  value={formData.title}
                                  onChange={e => setFormData({...formData, title: e.target.value})}
                              />
                          </div>
                          
                          <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content / Description</label>
                              <textarea 
                                  required
                                  rows={3}
                                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-brand-500 outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                                  placeholder="Enter the details..."
                                  value={formData.content}
                                  onChange={e => setFormData({...formData, content: e.target.value})}
                              />
                          </div>
                      </div>

                      {/* 3. File Upload Area */}
                      <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              {formData.category === 'General' ? 'Cover Image / Flyer (Optional)' : `Upload ${formData.category} File`}
                          </label>
                          
                          {!uploadedFile ? (
                              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 dark:bg-slate-800/50 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
                                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                      <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                                      <p className="text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                      <p className="text-xs text-gray-500 dark:text-gray-400">
                                          {formData.category === 'General' ? 'PNG, JPG (Max 5MB)' : formData.category === 'Audio' ? 'MP3, WAV (Max 10MB)' : 'MP4 (Max 50MB)'}
                                      </p>
                                  </div>
                                  <input 
                                      type="file" 
                                      className="hidden" 
                                      accept={formData.category === 'General' ? 'image/*' : formData.category === 'Audio' ? 'audio/*' : 'video/*'}
                                      onChange={handleFileChange}
                                  />
                              </label>
                          ) : (
                            <div className="space-y-3">
                              <div className="relative w-full p-4 border rounded-xl bg-gray-50 dark:bg-slate-800 flex items-center gap-4">
                                  <div className="p-3 bg-white dark:bg-slate-700 rounded-lg shadow-sm">
                                      {formData.category === 'General' ? <ImageIcon className="w-6 h-6 text-blue-500"/> : 
                                       formData.category === 'Audio' ? <Music className="w-6 h-6 text-purple-500"/> : 
                                       <Video className="w-6 h-6 text-red-500"/>}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{uploadedFile.name}</p>
                                      <p className="text-xs text-gray-500">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                  </div>
                                  <button onClick={removeFile} type="button" className="p-2 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-full">
                                      <X className="w-4 h-4 text-gray-500"/>
                                  </button>
                              </div>

                              {/* IMAGE PREVIEW: Show full flyer/image scaled correctly */}
                              {formData.category === 'General' && previewUrl && (
                                <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-black/20">
                                    <img 
                                        src={previewUrl} 
                                        alt="Preview" 
                                        className="w-full h-auto max-h-[600px] object-contain mx-auto" 
                                    />
                                </div>
                              )}
                            </div>
                          )}
                      </div>

                      {/* 4. Scheduling */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-blue-50 dark:bg-slate-800/50 rounded-xl border border-blue-100 dark:border-slate-700">
                           <div className="md:col-span-2 flex items-center gap-2 mb-1">
                                <Calendar className="w-4 h-4 text-blue-600"/>
                                <span className="text-sm font-bold text-blue-900 dark:text-blue-300">Visibility Schedule</span>
                           </div>
                           <div>
                               <label className="block text-xs font-semibold text-gray-500 mb-1">Start Date & Time</label>
                               <input 
                                  type="datetime-local"
                                  className="w-full border rounded-lg p-2 text-sm bg-white dark:bg-slate-900 dark:border-slate-600 dark:text-white"
                                  value={formData.startDate}
                                  onChange={e => setFormData({...formData, startDate: e.target.value})}
                               />
                           </div>
                           <div>
                               <label className="block text-xs font-semibold text-gray-500 mb-1">End Date & Time</label>
                               <input 
                                  type="datetime-local"
                                  className="w-full border rounded-lg p-2 text-sm bg-white dark:bg-slate-900 dark:border-slate-600 dark:text-white"
                                  value={formData.endDate}
                                  onChange={e => setFormData({...formData, endDate: e.target.value})}
                               />
                           </div>
                      </div>

                      {/* 5. Notification Toggle & Submit */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                          <label className="flex items-center gap-3 cursor-pointer group">
                              <div className="relative">
                                  <input 
                                      type="checkbox" 
                                      className="sr-only peer"
                                      checked={formData.notify}
                                      onChange={e => setFormData({...formData, notify: e.target.checked})}
                                  />
                                  <div className="w-11 h-6 bg-gray-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
                              </div>
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                                  Push Notification <Bell className="w-3 h-3 text-red-500" />
                              </span>
                          </label>

                          <div className="flex gap-3">
                              <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
                              <Button type="submit" isLoading={isSubmitting} className="gap-2 shadow-lg">
                                  {formData.notify ? <Send className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                  Post Announcement
                              </Button>
                          </div>
                      </div>
                  </form>
              </Card>
          )}

          {/* List of Announcements */}
          <div className="space-y-4">
              <h3 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wide">Active & Scheduled</h3>
              {announcements.length === 0 && <p className="text-gray-500 italic">No announcements posted yet.</p>}
              
              {announcements.map(ann => {
                  const now = new Date();
                  const start = ann.startDate ? new Date(ann.startDate) : new Date(ann.date);
                  const end = ann.endDate ? new Date(ann.endDate) : null;
                  
                  let statusColor = 'bg-gray-100 text-gray-600';
                  let statusText = 'Draft';

                  if (end && now > end) {
                      statusColor = 'bg-red-100 text-red-600';
                      statusText = 'Expired';
                  } else if (now < start) {
                      statusColor = 'bg-yellow-100 text-yellow-700';
                      statusText = 'Scheduled';
                  } else {
                      statusColor = 'bg-green-100 text-green-700';
                      statusText = 'Active';
                  }

                  return (
                      <Card key={ann.id} className="p-0 overflow-hidden hover:border-brand-300 transition-all">
                          <div className="p-4 flex gap-4">
                              <div className="flex-shrink-0">
                                  {ann.imageUrl ? (
                                    <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden">
                                        <img src={ann.imageUrl} alt="" className="w-full h-full object-cover" />
                                    </div>
                                  ) : (
                                    <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${ann.category === 'Video' ? 'bg-red-50 text-red-500' : ann.category === 'Audio' ? 'bg-purple-50 text-purple-500' : 'bg-blue-50 text-blue-500'}`}>
                                        {ann.category === 'Video' ? <Video className="w-8 h-8"/> : ann.category === 'Audio' ? <Mic2 className="w-8 h-8"/> : <FileText className="w-8 h-8"/>}
                                    </div>
                                  )}
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-start">
                                      <h4 className="font-bold text-gray-900 dark:text-white truncate">{ann.title}</h4>
                                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${statusColor}`}>{statusText}</span>
                                  </div>
                                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1 mt-1">{ann.content}</p>
                                  
                                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                      <span className="flex items-center gap-1">
                                          <Calendar className="w-3 h-3"/> 
                                          {start.toLocaleDateString()} {start.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})} 
                                          <span className="mx-1">→</span>
                                          {end ? end.toLocaleDateString() : 'No Expiry'}
                                      </span>
                                  </div>
                              </div>

                              <div className="flex items-center">
                                  <button 
                                      onClick={() => handleDelete(ann.id)}
                                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                      title="Delete"
                                  >
                                      <Trash2 className="w-5 h-5" />
                                  </button>
                              </div>
                          </div>
                      </Card>
                  );
              })}
          </div>
      </div>
    </div>
  );
};

export default StewardDashboard;
