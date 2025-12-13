import React, { useState, useEffect } from 'react';
import { ContentService } from '../services/api';
import { Announcement } from '../types';
import { Card, Button, PageHeader, LoadingScreen, Badge } from '../components/UI';
import { Mic, Video, FileText, Play } from 'lucide-react';

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
      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
        {['All', 'General', 'Audio', 'Video'].map(type => (
          <button
            key={type}
            onClick={() => setFilter(type as any)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filter === type 
                ? 'bg-brand-600 text-white' 
                : 'bg-white text-gray-600 border hover:bg-gray-50'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredItems.map(item => (
          <Card key={item.id} className="flex flex-col md:flex-row gap-4 p-4">
             {item.imageUrl && (
                <div className="w-full md:w-48 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                </div>
             )}
             <div className="flex-1">
               <div className="flex items-center gap-2 mb-2">
                 <Badge color={item.category === 'Video' ? 'red' : item.category === 'Audio' ? 'blue' : 'gray'}>
                   {item.category}
                 </Badge>
                 <span className="text-xs text-gray-500">{new Date(item.date).toLocaleDateString()}</span>
               </div>
               <h3 className="font-bold text-lg mb-2">{item.title}</h3>
               <p className="text-gray-600 text-sm mb-3">{item.content}</p>
               
               {item.category === 'Audio' && item.mediaUrl && (
                 <div className="bg-gray-50 p-2 rounded-lg flex items-center gap-3">
                   <div className="bg-blue-100 p-2 rounded-full"><Mic className="w-4 h-4 text-blue-600"/></div>
                   <audio controls src={item.mediaUrl} className="w-full h-8" />
                 </div>
               )}

               {item.category === 'Video' && item.mediaUrl && (
                  <div className="mt-2 aspect-video bg-black rounded-lg overflow-hidden relative group">
                    <video controls src={item.mediaUrl} className="w-full h-full" />
                  </div>
               )}
             </div>
          </Card>
        ))}
        {filteredItems.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No announcements found in this category.
          </div>
        )}
      </div>
    </div>
  );
};

export default Announcements;
