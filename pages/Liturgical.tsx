import React, { useEffect, useState } from 'react';
import { ContentService } from '../services/api';
import { LiturgicalSeason } from '../types';
import { PageHeader, LoadingScreen, Card } from '../components/UI';

const Liturgical: React.FC = () => {
  const [seasons, setSeasons] = useState<LiturgicalSeason[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ContentService.getSeasons().then(data => {
      setSeasons(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingScreen />;

  const currentSeason = seasons.find(s => s.current);

  return (
    <div>
      <PageHeader title="Liturgical Calendar" />

      {currentSeason && (
          <div 
            className="mb-8 rounded-xl p-8 text-white shadow-lg relative overflow-hidden"
            style={{ backgroundColor: currentSeason.color.toLowerCase() === 'purple' ? '#7e22ce' : '#15803d' }} 
          >
              <div className="relative z-10">
                <span className="uppercase tracking-widest text-sm font-semibold opacity-80 mb-2 block">Current Season</span>
                <h2 className="text-4xl font-bold mb-4">{currentSeason.name}</h2>
                <p className="text-lg opacity-90 max-w-xl">{currentSeason.description}</p>
                <div className="mt-6 inline-block bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
                    {new Date(currentSeason.startDate).toLocaleDateString()} — {new Date(currentSeason.endDate).toLocaleDateString()}
                </div>
              </div>
          </div>
      )}

      <h3 className="font-bold text-gray-900 text-xl mb-4">All Seasons</h3>
      <div className="grid gap-4 md:grid-cols-2">
          {seasons.map(season => (
              <Card key={season.id} className="p-5 flex gap-4 items-start">
                  <div 
                    className="w-4 h-full rounded-full self-stretch"
                    style={{ backgroundColor: season.color.toLowerCase() === 'purple' ? '#7e22ce' : '#15803d' }}
                  ></div>
                  <div>
                      <h4 className="font-bold text-lg">{season.name}</h4>
                      <p className="text-gray-500 text-sm mb-2">{season.color}</p>
                      <p className="text-gray-700 text-sm">{season.description}</p>
                      <div className="mt-2 text-xs text-gray-400">
                        {new Date(season.startDate).toLocaleDateString()} - {new Date(season.endDate).toLocaleDateString()}
                      </div>
                  </div>
              </Card>
          ))}
      </div>
    </div>
  );
};

export default Liturgical;
