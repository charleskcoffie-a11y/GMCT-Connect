import React, { useState, useEffect } from 'react';
import { ContentService } from '../services/api';
import { Announcement } from '../types';
import { Card, PageHeader, LoadingScreen, Badge } from '../components/UI';
import { Mic, FileText, Calendar } from 'lucide-react';

const Announcements: React.FC = () => {
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'All' | 'General' | 'Audio' | 'Video'>('All');

  useEffect(() => {
    ContentService.getAnnouncements().then(data => {
      setItems(data);
      setLoading(false);
    });
  }, []);

  const filteredItems = filter === 'All' ? items : items.filter(i => i.category === filter);

  if (loading) return <LoadingScreen />;

  return (
    <div>
      <PageHeader title="Announcements" />
      
      {/* Tabs */}
      <div className="flex space-x-2 mb-8 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 no-scrollbar">
        {['All', 'General', 'Audio', 'Video'].map(type => (
          <button
            key={type}
            onClick={() => setFilter(type as any)}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
              filter === type 
                ? 'bg-brand-600 text-white shadow-md' 
                : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {filteredItems.map(item => (
          <Card key={item.id} className="overflow-hidden border-l-4 border-l-brand-600">
             <div className="flex flex-col md:flex-row">
                 {item.imageUrl && (
                    <div className="w-full md:w-64 h-48 md:h-auto flex-shrink-0 relative">
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                 )}
                 <div className="p-5 md:p-6 flex-1">
                   <div className="flex items-center gap-3 mb-3">
                     <Badge color={item.category === 'Video' ? 'red' : item.category === 'Audio' ? 'blue' : 'gray'}>
                       {item.category}
                     </Badge>
                     <span className="text-xs font-medium text-gray-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(item.date).toLocaleDateString()}
                     </span>
                   </div>
                   
                   <h3 className="font-bold text-lg md:text-xl mb-2 text-brand-900 dark:text-white">{item.title}</h3>
                   <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">{item.content}</p>
                   
                   {item.category === 'Audio' && item.mediaUrl && (
                     <div className="bg-brand-50 dark:bg-brand-900/20 p-3 rounded-xl flex items-center gap-3 border border-brand-100 dark:border-brand-800/50">
                       <div className="bg-brand-100 dark:bg-brand-800 p-2 rounded-full"><Mic className="w-5 h-5 text-brand-600 dark:text-brand-300"/></div>
                       <div className="flex-1">
                          <span className="text-xs font-bold text-brand-700 dark:text-brand-300 block mb-1">Audio Playback</span>
                          <audio controls src={item.mediaUrl} className="w-full h-8 accent-brand-600" />
                       </div>
                     </div>
                   )}

                   {item.category === 'Video' && item.mediaUrl && (
                      <div className="mt-3 aspect-video bg-black rounded-xl overflow-hidden shadow-sm relative group">
                        <video controls src={item.mediaUrl} className="w-full h-full" />
                      </div>
                   )}
                 </div>
             </div>
          </Card>
        ))}
        {filteredItems.length === 0 && (
          <div className="text-center py-16">
             <div className="bg-gray-100 dark:bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
             </div>
             <p className="text-gray-500 dark:text-gray-400 font-medium">No announcements found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Announcements;