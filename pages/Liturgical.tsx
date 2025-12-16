import React, { useEffect, useState } from 'react';
import { ContentService } from '../services/api';
import { LiturgicalSeason } from '../types';
import { PageHeader, LoadingScreen, Card } from '../components/UI';
import { X, Calendar, Palette, BookOpen } from 'lucide-react';

// Extended season information
const SEASON_DETAILS: Record<string, {
  meaning: string;
  significance: string;
  traditions: string[];
  symbols: string[];
}> = {
  'Advent': {
    meaning: 'Advent means "coming" or "arrival" - a time of preparation for the celebration of Christ\'s birth and His second coming.',
    significance: 'This season calls us to prepare our hearts through prayer, reflection, and repentance. It reminds us of the prophets who foretold Christ\'s coming and encourages us to watch and wait with hope.',
    traditions: ['Advent wreath with four candles', 'Daily devotions and Scripture readings', 'Acts of service and charity'],
    symbols: ['Purple/Blue candles', 'Advent wreath', 'Star of Bethlehem', 'Jesse tree']
  },
  'Christmas': {
    meaning: 'Christmas celebrates the incarnation - God becoming human in Jesus Christ, born in Bethlehem.',
    significance: 'This joyous season proclaims the good news that God is with us (Emmanuel). It celebrates the gift of salvation through Christ and the hope He brings to the world.',
    traditions: ['Nativity scenes', 'Carol singing', 'Sharing gifts', 'Family gatherings'],
    symbols: ['White and gold colors', 'Angels', 'Manger scene', 'Shepherds and wise men']
  },
  'Epiphany': {
    meaning: 'Epiphany means "manifestation" - celebrating Christ being revealed to the Gentiles (non-Jews) through the visit of the Magi.',
    significance: 'This season emphasizes that Jesus came for all people, not just one nation. It celebrates the light of Christ shining to all nations and the mission of the church to share this light.',
    traditions: ['Remembering the visit of the Magi', 'Blessing of homes', 'Mission emphasis'],
    symbols: ['Gold, frankincense, and myrrh', 'Star', 'Light', 'Crown']
  },
  'Lent': {
    meaning: 'Lent is a 40-day period of fasting, prayer, and repentance in preparation for Easter, mirroring Jesus\' 40 days in the wilderness.',
    significance: 'This solemn season calls us to self-examination, spiritual discipline, and renewed commitment. It\'s a time to turn away from sin and turn toward God, preparing our hearts for the joy of resurrection.',
    traditions: ['Ash Wednesday service', 'Fasting or giving up something', 'Increased prayer and Bible study', 'Almsgiving'],
    symbols: ['Purple color', 'Ashes', 'Cross', 'Crown of thorns', 'Desert']
  },
  'Holy Week': {
    meaning: 'Holy Week is the most sacred week of the Christian year, commemorating Jesus\' final days, crucifixion, and burial.',
    significance: 'This week walks us through Christ\'s passion - from His triumphant entry to Jerusalem, through His suffering and death, to the silence of Holy Saturday. It confronts us with the cost of our redemption.',
    traditions: ['Palm Sunday procession', 'Maundy Thursday communion', 'Good Friday service', 'Easter vigil'],
    symbols: ['Palms', 'Bread and wine', 'Cross', 'Veil', 'Tomb']
  },
  'Easter': {
    meaning: 'Easter celebrates the resurrection of Jesus Christ from the dead - the cornerstone of Christian faith.',
    significance: 'This is the most joyous season, proclaiming victory over sin and death. The resurrection proves Jesus is Lord and gives us hope of eternal life. It\'s the foundation of our faith and the source of our joy.',
    traditions: ['Sunrise services', 'Baptisms', 'Joyful worship', 'Easter lilies', 'Alleluia returns'],
    symbols: ['White and gold', 'Empty tomb', 'Butterfly', 'Lily', 'Risen Christ']
  },
  'Pentecost': {
    meaning: 'Pentecost celebrates the coming of the Holy Spirit upon the apostles and the birth of the Church.',
    significance: 'This season emphasizes the power and presence of the Holy Spirit in the church and in believers\' lives. It celebrates the mission of the church and the gifts of the Spirit for ministry.',
    traditions: ['Wearing red', 'Celebrating spiritual gifts', 'Mission emphasis', 'Confirmation services'],
    symbols: ['Red color', 'Flames of fire', 'Dove', 'Wind', 'Many languages']
  },
  'Ordinary Time': {
    meaning: 'Ordinary Time (from "ordinal" meaning "counted time") focuses on the teachings and ministry of Jesus, growth in discipleship.',
    significance: 'This is the longest season, emphasizing faithful Christian living and spiritual growth. It calls us to apply Christ\'s teachings in our daily lives and grow in grace and knowledge.',
    traditions: ['Focus on teaching and discipleship', 'Study of Jesus\' parables', 'Emphasis on spiritual formation'],
    symbols: ['Green color (growth)', 'Bible', 'Seeds and plants', 'Journey']
  }
};

const Liturgical: React.FC = () => {
  const [seasons, setSeasons] = useState<LiturgicalSeason[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState<LiturgicalSeason | null>(null);

  useEffect(() => {
    ContentService.getSeasons().then(data => {
      setSeasons(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingScreen />;

  const currentSeason = seasons.find(s => s.current);

  const getColorStyle = (colorName: string) => {
    const colors: Record<string, string> = {
      'purple': '#7e22ce',
      'white': '#f9fafb',
      'gold': '#d97706',
      'green': '#15803d',
      'red': '#dc2626',
      'blue': '#2563eb'
    };
    return colors[colorName.toLowerCase()] || '#6b7280';
  };

  const getYearContext = (season: LiturgicalSeason) => {
    const currentYear = new Date().getFullYear();
    const startDate = new Date(season.startDate);
    const endDate = new Date(season.endDate);
    const seasonYear = startDate.getFullYear();
    
    return {
      year: seasonYear === currentYear ? currentYear : `${seasonYear}/${endDate.getFullYear()}`,
      startDate: startDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      endDate: endDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      duration: Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    };
  };

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
              <Card 
                key={season.id} 
                className="p-5 flex gap-4 items-start hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedSeason(season)}
              >
                  <div 
                    className="w-4 h-full rounded-full self-stretch flex-shrink-0"
                    style={{ backgroundColor: getColorStyle(season.color) }}
                  ></div>
                  <div className="flex-1">
                      <h4 className="font-bold text-lg">{season.name}</h4>
                      <p className="text-gray-500 text-sm mb-2 flex items-center gap-1">
                        <Palette className="w-3 h-3" />
                        {season.color}
                      </p>
                      <p className="text-gray-700 text-sm mb-2">{season.description}</p>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Calendar className="w-3 h-3" />
                        {new Date(season.startDate).toLocaleDateString()} - {new Date(season.endDate).toLocaleDateString()}
                      </div>
                      <p className="text-xs text-blue-600 mt-2 font-medium">Click to learn more →</p>
                  </div>
              </Card>
          ))}
      </div>

      {/* Season Detail Modal */}
      {selectedSeason && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto"
          onClick={() => setSelectedSeason(null)}
        >
          <div
            className="bg-white rounded-xl max-w-3xl w-full my-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="p-6 text-white rounded-t-xl relative"
              style={{ backgroundColor: getColorStyle(selectedSeason.color) }}
            >
              <button
                onClick={() => setSelectedSeason(null)}
                className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-3xl font-bold mb-2">{selectedSeason.name}</h2>
              <p className="text-lg opacity-90">{selectedSeason.description}</p>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
              {/* Liturgical Color */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 flex-shrink-0">
                  <Palette className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1">Liturgical Color</h3>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded border-2 border-gray-300"
                      style={{ backgroundColor: getColorStyle(selectedSeason.color) }}
                    ></div>
                    <span className="text-gray-700 font-medium">{selectedSeason.color}</span>
                  </div>
                </div>
              </div>

              {/* Dates for Current Year */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 flex-shrink-0">
                  <Calendar className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1">
                    Season Dates ({getYearContext(selectedSeason).year})
                  </h3>
                  <div className="text-gray-700 space-y-1">
                    <p><strong>Begins:</strong> {getYearContext(selectedSeason).startDate}</p>
                    <p><strong>Ends:</strong> {getYearContext(selectedSeason).endDate}</p>
                    <p className="text-sm text-gray-500">Duration: {getYearContext(selectedSeason).duration} days</p>
                  </div>
                </div>
              </div>

              {/* Meaning */}
              {SEASON_DETAILS[selectedSeason.name] && (
                <>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 flex-shrink-0">
                      <BookOpen className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-1">Meaning</h3>
                      <p className="text-gray-700 leading-relaxed">
                        {SEASON_DETAILS[selectedSeason.name].meaning}
                      </p>
                    </div>
                  </div>

                  {/* Significance */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-bold text-blue-900 mb-2">Spiritual Significance</h3>
                    <p className="text-blue-800 leading-relaxed">
                      {SEASON_DETAILS[selectedSeason.name].significance}
                    </p>
                  </div>

                  {/* Traditions */}
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Common Traditions & Practices</h3>
                    <ul className="space-y-1.5">
                      {SEASON_DETAILS[selectedSeason.name].traditions.map((tradition, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-gray-700">
                          <span className="text-blue-600 mt-1">•</span>
                          <span>{tradition}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Symbols */}
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Symbols & Images</h3>
                    <div className="flex flex-wrap gap-2">
                      {SEASON_DETAILS[selectedSeason.name].symbols.map((symbol, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                          {symbol}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Liturgical;
