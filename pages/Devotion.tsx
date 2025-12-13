import React, { useEffect, useState } from 'react';
import { ContentService } from '../services/api';
import { Devotion } from '../types';
import { PageHeader, LoadingScreen, Button, Card } from '../components/UI';
import { Sparkles, Archive, ChevronDown, ChevronUp } from 'lucide-react';

const DevotionPage: React.FC = () => {
  const [devotions, setDevotions] = useState<Devotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    ContentService.getDevotions().then(data => {
      setDevotions(data);
      setLoading(false);
    });
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const newDevotion = await ContentService.generateDevotion();
      setDevotions([newDevotion, ...devotions]);
      window.scrollTo(0,0);
    } finally {
      setGenerating(false);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  }

  if (loading) return <LoadingScreen />;

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader 
        title="Daily Devotions" 
        action={
          <Button onClick={handleGenerate} isLoading={generating} className="gap-2 shadow-sm">
            <Sparkles className="w-4 h-4" /> AI Generate Today's
          </Button>
        }
      />

      <div className="space-y-6">
        {devotions.map((devotion, index) => {
            const isFirst = index === 0;
            const isExpanded = expandedId === devotion.id || isFirst;

            return (
                <Card key={devotion.id} className={`${isFirst ? 'border-brand-200 ring-4 ring-brand-50' : 'border-gray-200'}`}>
                    <div 
                        className="p-5 flex justify-between items-center cursor-pointer bg-gray-50/50 border-b border-gray-100"
                        onClick={() => toggleExpand(devotion.id)}
                    >
                        <div>
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                                {new Date(devotion.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                            </span>
                            <h3 className="text-lg font-bold text-gray-900">{devotion.title}</h3>
                        </div>
                        <button className="text-gray-400">
                            {isExpanded ? <ChevronUp /> : <ChevronDown />}
                        </button>
                    </div>
                    
                    {isExpanded && (
                        <div className="p-6 pt-4">
                            <blockquote className="border-l-4 border-teal-500 pl-4 py-1 my-4 bg-teal-50 rounded-r text-teal-900 italic font-serif text-lg">
                                "{devotion.scripture}"
                            </blockquote>
                            <div className="prose prose-blue max-w-none text-gray-700 leading-relaxed">
                                <p>{devotion.content}</p>
                            </div>
                            <div className="mt-6 bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                                <p className="font-bold text-yellow-800 text-sm uppercase mb-1">Prayer</p>
                                <p className="text-gray-800 italic">"{devotion.prayer}"</p>
                            </div>
                        </div>
                    )}
                </Card>
            );
        })}
      </div>
    </div>
  );
};

export default DevotionPage;
