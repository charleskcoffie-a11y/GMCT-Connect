import React, { useEffect, useState } from 'react';
import { ContentService } from '../services/api';
import { Devotion } from '../types';
import { PageHeader, LoadingScreen, Button, Card } from '../components/UI';
import { Sparkles, ChevronDown, ChevronUp, Share2, BookOpen } from 'lucide-react';

const DevotionPage: React.FC = () => {
  const [devotions, setDevotions] = useState<Devotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    ContentService.getDevotions().then(data => {
      setDevotions(data);
      setLoading(false);
      // Auto expand first one
      if (data.length > 0) setExpandedId(data[0].id);
    });
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const newDevotion = await ContentService.generateDevotion();
      setDevotions([newDevotion, ...devotions]);
      setExpandedId(newDevotion.id);
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
          <Button onClick={handleGenerate} isLoading={generating} variant="accent" className="gap-2 shadow-sm border border-accent-600 text-white bg-accent-500 hover:bg-accent-600">
            <Sparkles className="w-4 h-4" /> AI Generate
          </Button>
        }
      />

      <div className="space-y-4">
        {devotions.map((devotion) => {
            const isExpanded = expandedId === devotion.id;

            return (
                <Card 
                    key={devotion.id} 
                    className={`transition-all duration-300 ${isExpanded ? 'border-l-[6px] border-l-accent-500 shadow-md ring-1 ring-black/5 dark:ring-white/5' : 'border-l-4 border-l-transparent opacity-90'}`}
                >
                    <div 
                        className={`p-5 flex justify-between items-center cursor-pointer ${isExpanded ? 'border-b border-app-border dark:border-gray-800' : ''}`}
                        onClick={() => toggleExpand(devotion.id)}
                    >
                        <div>
                            <span className="text-xs font-bold text-accent-600 dark:text-accent-500 uppercase tracking-wider mb-1 block">
                                {new Date(devotion.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                            </span>
                            <h3 className="text-lg font-bold text-brand-900 dark:text-white">{devotion.title}</h3>
                        </div>
                        <button className="text-app-subtext p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
                            {isExpanded ? <ChevronUp className="w-5 h-5"/> : <ChevronDown className="w-5 h-5"/>}
                        </button>
                    </div>
                    
                    {isExpanded && (
                        <div className="p-6 pt-6 animate-in slide-in-from-top-2 fade-in duration-200">
                            <div className="flex items-start gap-3 mb-6">
                                <div className="p-2 bg-accent-50 dark:bg-accent-900/20 rounded-lg text-accent-700 dark:text-accent-400 mt-1">
                                    <BookOpen className="w-5 h-5" />
                                </div>
                                <blockquote className="text-lg font-serif italic text-gray-800 dark:text-gray-200 leading-relaxed border-l-2 border-accent-200 dark:border-accent-800 pl-4">
                                    "{devotion.scripture}"
                                </blockquote>
                            </div>

                            <div className="prose prose-slate dark:prose-invert max-w-none text-app-text dark:text-gray-300 leading-relaxed text-base">
                                <p>{devotion.content}</p>
                            </div>

                            <div className="mt-8 bg-accent-50 dark:bg-accent-900/10 p-5 rounded-xl border border-accent-100 dark:border-accent-900/30">
                                <p className="font-bold text-accent-700 dark:text-accent-400 text-xs uppercase mb-2 tracking-wide">Prayer</p>
                                <p className="text-gray-800 dark:text-gray-200 italic font-medium">"{devotion.prayer}"</p>
                            </div>

                            <div className="mt-6 flex justify-end">
                                <Button variant="ghost" size="sm" className="text-app-subtext gap-2">
                                    <Share2 className="w-4 h-4" /> Share
                                </Button>
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