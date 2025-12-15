
import React, { useEffect, useState } from 'react';
import { ContentService } from '../services/api';
import { Hymn, HymnBook } from '../types';
import { PageHeader, LoadingScreen, Button, Card } from '../components/UI';
import { Search, Music, X } from 'lucide-react';

const Hymnal: React.FC = () => {
  const [hymns, setHymns] = useState<Hymn[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState<HymnBook | 'All'>('All');
  const [search, setSearch] = useState('');
  const [readingHymn, setReadingHymn] = useState<Hymn | null>(null);

  useEffect(() => {
    // Initial load
    ContentService.getHymns().then(data => {
        setHymns(data);
        setLoading(false);
    });
  }, []);

  useEffect(() => {
      // Debounced search mock
      const timer = setTimeout(() => {
          setLoading(true);
          ContentService.getHymns(search, selectedBook === 'All' ? undefined : selectedBook)
            .then(data => {
                setHymns(data);
                setLoading(false);
            });
      }, 300);
      return () => clearTimeout(timer);
  }, [search, selectedBook]);

  if (readingHymn) {
      return (
        <div className="max-w-2xl mx-auto h-full flex flex-col">
            <Button variant="ghost" onClick={() => setReadingHymn(null)} className="mb-4 gap-2 self-start text-white hover:bg-white/10 hover:text-white">
                <X className="w-4 h-4" /> Close
            </Button>
            <Card variant="standard" className="flex-1 p-8 md:p-12 overflow-y-auto shadow-2xl">
                <div className="text-center mb-8 border-b border-gray-100 pb-6">
                    <span className={`text-sm font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                        readingHymn.book === 'MHB' ? 'bg-red-100 text-red-700' :
                        readingHymn.book === 'CAN' ? 'bg-blue-100 text-blue-700' :
                        'bg-purple-100 text-purple-700'
                    }`}>
                        {readingHymn.book} {readingHymn.number}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-bold mt-4 text-gray-900">{readingHymn.title}</h2>
                </div>
                <div className="whitespace-pre-line text-lg text-gray-800 leading-relaxed font-serif text-center pb-8">
                    {readingHymn.lyrics}
                </div>
            </Card>
        </div>
      )
  }

  return (
    <div>
      <PageHeader title="Hymnal" />
      
      <div className="flex flex-col gap-4 mb-6">
          <div className="relative w-full">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input 
                type="text" 
                placeholder="Search title, number..." 
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none text-base bg-white text-gray-900"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                inputMode="search"
            />
          </div>
          {/* Horizontal scrollable filter list for mobile */}
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
            {(['All', 'MHB', 'CAN', 'Canticles'] as const).map(book => (
                <button
                    key={book}
                    onClick={() => setSelectedBook(book)}
                    className={`px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-colors flex-shrink-0 border ${
                        selectedBook === book 
                        ? 'bg-brand-600 text-white border-brand-600 shadow-sm' 
                        : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                    }`}
                >
                    {book}
                </button>
            ))}
          </div>
      </div>

      {loading ? <LoadingScreen /> : (
          <div className="grid gap-2">
              {hymns.map((hymn, index) => {
                  const isEven = index % 2 === 0;
                  let colorClass = '';
                  
                  // Book-specific alternating colors (Calm palette)
                  switch (hymn.book) {
                      case 'MHB':
                          colorClass = isEven ? '!bg-rose-50/80 !border-rose-100' : '!bg-white !border-rose-50/50';
                          break;
                      case 'CAN':
                          colorClass = isEven ? '!bg-sky-50/80 !border-sky-100' : '!bg-white !border-sky-50/50';
                          break;
                      case 'Canticles':
                          colorClass = isEven ? '!bg-purple-50/80 !border-purple-100' : '!bg-white !border-purple-50/50';
                          break;
                      default:
                          colorClass = isEven ? '!bg-gray-50/80' : '!bg-white';
                  }

                  return (
                    <Card 
                        key={hymn.id} 
                        variant="standard"
                        className={`p-4 flex justify-between items-center hover:shadow-md cursor-pointer transition-all active:scale-[0.99] touch-manipulation border ${colorClass}`}
                        onClick={() => setReadingHymn(hymn)}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                                hymn.book === 'MHB' ? 'bg-red-100 text-red-700' :
                                hymn.book === 'CAN' ? 'bg-blue-100 text-blue-700' :
                                'bg-purple-100 text-purple-700'
                            }`}>
                                {hymn.number}
                            </div>
                            <div className="min-w-0">
                                <h3 className="font-semibold text-gray-900 truncate pr-2">{hymn.title}</h3>
                                <span className={`text-xs font-medium ${
                                    hymn.book === 'MHB' ? 'text-red-600/70' :
                                    hymn.book === 'CAN' ? 'text-blue-600/70' :
                                    'text-purple-600/70'
                                }`}>{hymn.book}</span>
                            </div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-gray-400"><Music className="w-4 h-4" /></Button>
                    </Card>
                  );
              })}
              {hymns.length === 0 && (
                  <div className="text-center py-12 text-white/50">
                      No hymns found matching your search.
                  </div>
              )}
          </div>
      )}
    </div>
  );
};

export default Hymnal;
