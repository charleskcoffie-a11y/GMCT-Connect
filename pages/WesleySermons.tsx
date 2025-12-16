import React, { useState } from 'react';
import { PageHeader, Card } from '../components/UI';
import { Book, Search, ChevronRight } from 'lucide-react';

interface Sermon {
  number: number;
  title: string;
  scripture: string;
  text?: string;
}

const WESLEY_SERMONS: Sermon[] = [
  { number: 1, title: 'Salvation by Faith', scripture: 'Ephesians 2:8' },
  { number: 2, title: 'The Almost Christian', scripture: 'Acts 26:28' },
  { number: 3, title: 'Awake, Thou That Sleepest', scripture: 'Ephesians 5:14' },
  { number: 4, title: 'Scriptural Christianity', scripture: 'Acts 4:31' },
  { number: 5, title: 'Justification by Faith', scripture: 'Romans 4:5' },
  { number: 6, title: 'The Righteousness of Faith', scripture: 'Romans 10:5-8' },
  { number: 7, title: 'The Way to the Kingdom', scripture: 'Mark 1:15' },
  { number: 8, title: 'The First Fruits of the Spirit', scripture: 'Romans 8:1' },
  { number: 9, title: 'The Spirit of Bondage and of Adoption', scripture: 'Romans 8:15' },
  { number: 10, title: 'The Witness of the Spirit, Discourse 1', scripture: 'Romans 8:16' },
  { number: 11, title: 'The Witness of the Spirit, Discourse 2', scripture: 'Romans 8:16' },
  { number: 12, title: 'The Witness of Our Own Spirit', scripture: '2 Corinthians 1:12' },
  { number: 13, title: 'On Sin in Believers', scripture: '2 Corinthians 5:17' },
  { number: 14, title: 'The Repentance of Believers', scripture: 'Mark 1:15' },
  { number: 15, title: 'The Great Assize', scripture: 'Romans 14:10' },
  { number: 16, title: 'The Means of Grace', scripture: 'Malachi 3:7' },
  { number: 17, title: 'The Circumcision of the Heart', scripture: 'Romans 2:29' },
  { number: 18, title: 'The Marks of the New Birth', scripture: 'John 3:7' },
  { number: 19, title: 'The Great Privilege of Those That Are Born of God', scripture: '1 John 3:9' },
  { number: 20, title: 'The Lord Our Righteousness', scripture: 'Jeremiah 23:6' },
  { number: 21, title: 'Sermon on the Mount, Discourse 1', scripture: 'Matthew 5:1-4' },
  { number: 22, title: 'Sermon on the Mount, Discourse 2', scripture: 'Matthew 5:5-7' },
  { number: 23, title: 'Sermon on the Mount, Discourse 3', scripture: 'Matthew 5:8-12' },
  { number: 24, title: 'Sermon on the Mount, Discourse 4', scripture: 'Matthew 5:13-16' },
  { number: 25, title: 'Sermon on the Mount, Discourse 5', scripture: 'Matthew 5:17-20' },
  { number: 26, title: 'Sermon on the Mount, Discourse 6', scripture: 'Matthew 6:1-15' },
  { number: 27, title: 'Sermon on the Mount, Discourse 7', scripture: 'Matthew 6:16-18' },
  { number: 28, title: 'Sermon on the Mount, Discourse 8', scripture: 'Matthew 6:19-23' },
  { number: 29, title: 'Sermon on the Mount, Discourse 9', scripture: 'Matthew 6:24-34' },
  { number: 30, title: 'Sermon on the Mount, Discourse 10', scripture: 'Matthew 7:1-12' },
  { number: 31, title: 'Sermon on the Mount, Discourse 11', scripture: 'Matthew 7:13-14' },
  { number: 32, title: 'Sermon on the Mount, Discourse 12', scripture: 'Matthew 7:15-20' },
  { number: 33, title: 'Sermon on the Mount, Discourse 13', scripture: 'Matthew 7:21-27' },
  { number: 34, title: 'The Original, Nature, Properties, and Use of the Law', scripture: 'Romans 7:12' },
  { number: 35, title: 'The Law Established through Faith, Discourse 1', scripture: 'Romans 3:31' },
  { number: 36, title: 'The Law Established through Faith, Discourse 2', scripture: 'Romans 3:31' },
  { number: 37, title: 'The Nature of Enthusiasm', scripture: 'Acts 26:24' },
  { number: 38, title: 'A Caution against Bigotry', scripture: 'Mark 9:38-39' },
  { number: 39, title: 'Catholic Spirit', scripture: '2 Kings 10:15' },
  { number: 40, title: 'Christian Perfection', scripture: 'Philippians 3:12' },
  { number: 41, title: 'Wandering Thoughts', scripture: '2 Corinthians 10:5' },
  { number: 42, title: 'Satan\'s Devices', scripture: '2 Corinthians 2:11' },
  { number: 43, title: 'The Witness of the Spirit, Discourse 1', scripture: 'Romans 8:16' },
  { number: 44, title: 'Original Sin', scripture: 'Genesis 6:5' }
];

const WesleySermons: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSermon, setSelectedSermon] = useState<Sermon | null>(null);

  const filteredSermons = WESLEY_SERMONS.filter(
    sermon =>
      sermon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sermon.scripture.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sermon.number.toString().includes(searchTerm)
  );

  return (
    <div>
      <PageHeader
        title="John Wesley's 44 Sermons"
        subtitle="The Standard Sermons of Methodism"
      />

      {/* Introduction */}
      <Card className="p-6 mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="flex gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
            <Book className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">The Standard Sermons</h2>
            <p className="text-gray-700 leading-relaxed">
              These 44 sermons, preached and published by John Wesley between 1746 and 1760, 
              form the doctrinal standards of Methodism. They outline the core beliefs and 
              practices of the Methodist movement, covering topics such as salvation, faith, 
              sanctification, and Christian living.
            </p>
          </div>
        </div>
      </Card>

      {/* Search Bar */}
      <Card className="p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search sermons by title, scripture, or number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        {searchTerm && (
          <p className="text-sm text-gray-500 mt-2">
            Found {filteredSermons.length} sermon{filteredSermons.length !== 1 ? 's' : ''}
          </p>
        )}
      </Card>

      {/* Sermons List */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredSermons.map((sermon) => (
          <Card
            key={sermon.number}
            className="p-4 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-blue-600"
            onClick={() => setSelectedSermon(sermon)}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">
                    {sermon.number}
                  </span>
                  <h3 className="font-bold text-gray-900 text-lg">{sermon.title}</h3>
                </div>
                <p className="text-sm text-gray-600 ml-10">
                  <span className="font-medium">Scripture:</span> {sermon.scripture}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
            </div>
          </Card>
        ))}
      </div>

      {filteredSermons.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-gray-500">No sermons found matching "{searchTerm}"</p>
        </Card>
      )}

      {/* Sermon Detail Modal */}
      {selectedSermon && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedSermon(null)}
        >
          <Card
            className="max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-700 rounded-full text-lg font-bold">
                      {selectedSermon.number}
                    </span>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedSermon.title}</h2>
                  </div>
                  <p className="text-gray-600 ml-12">
                    <span className="font-medium">Scripture:</span> {selectedSermon.scripture}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedSermon(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                >
                  ×
                </button>
              </div>

              <div className="border-t pt-4">
                <p className="text-gray-600 italic mb-4">
                  Full sermon text coming soon. These sermons are available in the public domain 
                  and will be added to provide complete access to Wesley's teachings.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> These 44 sermons represent the doctrinal foundation of Methodism. 
                    Wesley considered them essential reading for all Methodist preachers and members.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default WesleySermons;
