
import React, { useEffect, useState } from 'react';
import { ContentService } from '../services/api';
import { DailyVerse as IDailyVerse } from '../types';
import { PageHeader, LoadingScreen, Button, Card } from '../components/UI';
import { Share2, Heart } from 'lucide-react';

const DailyVerse: React.FC = () => {
  const [verse, setVerse] = useState<IDailyVerse | null>(null);

  useEffect(() => {
    ContentService.getDailyVerse().then(setVerse);
  }, []);

  const handleShare = async () => {
    if (!verse) return;
    
    const shareText = `"${verse.text}" - ${verse.reference}\n\n#GhanaMethodistChurchOfToronto`;
    
    // Ensure URL is valid for sharing (must be http or https)
    let url = window.location.href;
    if (!url.startsWith('http')) {
        url = 'https://gmctconnect.org'; // Fallback URL
    }

    if (navigator.share) {
      try {
        await navigator.share({
            title: 'Daily Verse from GMCT',
            text: shareText,
            url: url,
        });
      } catch (error: any) {
        // If user cancelled, do nothing. If error (like Invalid URL), fallback.
        if (error.name !== 'AbortError') {
            console.error('Share failed, falling back to clipboard:', error);
            copyToClipboard(shareText);
        }
      }
    } else {
      copyToClipboard(shareText);
    }
  };

  const copyToClipboard = (text: string) => {
      navigator.clipboard.writeText(text).then(() => {
          alert('Verse copied to clipboard!');
      }).catch(() => {
          alert('Unable to copy to clipboard.');
      });
  };

  if (!verse) return <LoadingScreen />;

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader title="Daily Verse" />
      
      <Card className="overflow-hidden shadow-lg relative">
        <div className="relative h-96 w-full">
            <img 
                src={verse.imageUrl} 
                alt="Background" 
                className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>
            
            <div className="relative h-full flex flex-col items-center justify-center p-8 text-center text-white z-10">
                <p className="text-xs uppercase tracking-widest font-semibold mb-6 opacity-80">Verse of the Day</p>
                <blockquote className="font-serif text-2xl md:text-3xl font-medium leading-relaxed mb-6">
                "{verse.text}"
                </blockquote>
                <cite className="text-lg font-light not-italic opacity-90 block mb-1">{verse.reference}</cite>
                <span className="text-xs opacity-60">{verse.version}</span>
                
                {/* Church Branding Footer */}
                <div className="absolute bottom-6 left-0 right-0 text-center">
                    <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-white/80 drop-shadow-md">
                        Ghana Methodist Church – Toronto
                    </p>
                </div>
            </div>
        </div>
        <div className="p-4 bg-white flex justify-between items-center">
            <div className="text-sm text-gray-500">
                {new Date(verse.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <div className="flex gap-2">
                <Button variant="ghost" size="sm"><Heart className="w-5 h-5" /></Button>
                <Button variant="outline" size="sm" onClick={handleShare} className="gap-2">
                    <Share2 className="w-4 h-4" /> Share
                </Button>
            </div>
        </div>
      </Card>
    </div>
  );
};

export default DailyVerse;
