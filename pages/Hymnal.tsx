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
            <Button variant="ghost" onClick={() => setReadingHymn(null)} className="mb-4 gap-2 self-start">
                <X className="w-4 h-4" /> Close
            </Button>
            <Card className="flex-1 p-8 md:p-12 overflow-y-auto">
                <div className="text-center mb-8 border-b pb-6">
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
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none text-base"
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
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                >
                    {book}
                </button>
            ))}
          </div>
      </div>

      {loading ? <LoadingScreen /> : (
          <div className="grid gap-3">
              {hymns.map(hymn => (
                  <Card 
                    key={hymn.id} 
                    className="p-4 flex justify-between items-center hover:shadow-md cursor-pointer transition-all active:scale-[0.99] touch-manipulation"
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
                            <span className="text-xs text-gray-500 font-medium">{hymn.book}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm"><Music className="w-4 h-4" /></Button>
                  </Card>
              ))}
              {hymns.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                      No hymns found matching your search.
                  </div>
              )}
          </div>
      )}
    </div>
  );
};

export default Hymnal;