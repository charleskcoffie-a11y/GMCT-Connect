import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ContentService } from '../services/api';
import { Sermon } from '../types';
import { PageHeader, LoadingScreen, Card, Badge, Button } from '../components/UI';
import { PlayCircle, Mic, Tag, Book } from 'lucide-react';

const Sermons: React.FC = () => {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ContentService.getSermons().then(data => {
      setSermons(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <div>
      <PageHeader title="Sermons Archive" />
      
      {/* Wesley Sermons Card */}
      <Link to="/wesley-sermons">
        <Card className="p-6 mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Book className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-1">John Wesley's 44 Standard Sermons</h3>
              <p className="text-gray-700">
                Explore the doctrinal foundation of Methodism through Wesley's essential teachings
              </p>
            </div>
            <div className="text-blue-600 font-medium hidden sm:block">
              View All →
            </div>
          </div>
        </Card>
      </Link>

      <div className="space-y-4">
        {sermons.map(sermon => (
            <Card key={sermon.id} className="p-5">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <div className="text-sm text-gray-500 mb-1">{new Date(sermon.date).toLocaleDateString()}</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{sermon.title}</h3>
                        <p className="text-brand-600 font-medium mb-3">{sermon.preacher}</p>
                        <p className="text-gray-600 text-sm mb-4">{sermon.summary}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                            {sermon.tags.map(tag => (
                                <span key={tag} className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                    <Tag className="w-3 h-3" /> {tag}
                                </span>
                            ))}
                        </div>

                        <div className="flex gap-2">
                             {sermon.audioUrl && (
                                 <Button size="sm" className="gap-2">
                                     <Mic className="w-4 h-4" /> Listen
                                 </Button>
                             )}
                             {sermon.videoUrl && (
                                 <Button size="sm" variant="secondary" className="gap-2">
                                     <PlayCircle className="w-4 h-4" /> Watch
                                 </Button>
                             )}
                        </div>
                    </div>
                </div>
            </Card>
        ))}
      </div>
    </div>
  );
};

export default Sermons;
