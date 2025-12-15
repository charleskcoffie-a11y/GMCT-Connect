
import React, { useEffect, useState } from 'react';
import { ContentService } from '../services/api';
import { Organization } from '../types';
import { PageHeader, Card, LoadingScreen, Badge } from '../components/UI';
import { Users, Phone, Clock, MessageSquare, Music, Star, HeartHandshake } from 'lucide-react';

const Organizations: React.FC = () => {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'All' | 'Men' | 'Women' | 'Youth' | 'Music' | 'Service'>('All');

  useEffect(() => {
    ContentService.getOrganizations().then(data => {
      setOrgs(data);
      setLoading(false);
    });
  }, []);

  const filteredOrgs = filter === 'All' ? orgs : orgs.filter(o => o.category === filter || (filter === 'Service' && o.category === 'General'));

  // Icon helper
  const getCategoryIcon = (cat: string) => {
      switch(cat) {
          case 'Men': return <Users className="w-5 h-5 text-blue-600" />;
          case 'Women': return <HeartHandshake className="w-5 h-5 text-pink-600" />;
          case 'Music': return <Music className="w-5 h-5 text-purple-600" />;
          case 'Youth': return <Star className="w-5 h-5 text-yellow-600" />;
          default: return <Users className="w-5 h-5 text-gray-600" />;
      }
  };

  const getCategoryColor = (cat: string): 'blue' | 'red' | 'purple' | 'yellow' | 'gray' => {
     switch(cat) {
         case 'Men': return 'blue';
         case 'Women': return 'red';
         case 'Music': return 'purple';
         case 'Youth': return 'yellow';
         default: return 'gray';
     }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div>
      <PageHeader title="Organizations & Ministries" />
      
      {/* Filters */}
      <div className="flex space-x-2 mb-8 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 no-scrollbar">
        {['All', 'Men', 'Women', 'Youth', 'Music', 'Service'].map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat as any)}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
              filter === cat 
                ? 'bg-brand-600 text-white shadow-md' 
                : 'bg-white/10 text-gray-300 border border-white/20 hover:bg-white/20'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrgs.map(org => (
              <Card key={org.id} variant="standard" className="flex flex-col h-full border-t-4 border-t-brand-900 overflow-hidden">
                  <div className="p-5 flex-1">
                      <div className="flex justify-between items-start mb-4">
                          <div className={`p-3 rounded-xl bg-gray-50`}>
                             {getCategoryIcon(org.category)}
                          </div>
                          <Badge color={getCategoryColor(org.category)}>{org.category}</Badge>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-2">{org.name}</h3>
                      <p className="text-sm text-gray-600 mb-6 leading-relaxed">{org.description}</p>

                      <div className="space-y-4">
                          <div className="flex items-start gap-3 p-3 bg-brand-50 rounded-lg border border-brand-100">
                              <div className="bg-white p-1.5 rounded-md text-brand-600 shadow-sm">
                                  <Users className="w-4 h-4" />
                              </div>
                              <div>
                                  <span className="text-xs font-bold text-gray-400 uppercase block mb-0.5">Leader</span>
                                  <div className="text-sm font-bold text-gray-900">{org.leaderName}</div>
                                  <a href={`tel:${org.leaderPhone}`} className="text-xs text-brand-600 hover:underline flex items-center gap-1 mt-1">
                                      <Phone className="w-3 h-3" /> {org.leaderPhone}
                                  </a>
                              </div>
                          </div>

                          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                               <div className="bg-white p-1.5 rounded-md text-gray-600 shadow-sm">
                                  <Clock className="w-4 h-4" />
                              </div>
                              <div>
                                  <span className="text-xs font-bold text-gray-400 uppercase block mb-0.5">Meeting Time</span>
                                  <div className="text-sm font-medium text-gray-900">{org.meetingTime}</div>
                              </div>
                          </div>
                      </div>
                  </div>
                  
                  {/* Announcements Footer */}
                  {org.announcements.length > 0 && (
                      <div className="bg-gray-50 border-t border-gray-100 p-4">
                          <div className="flex items-center gap-2 mb-2">
                             <MessageSquare className="w-4 h-4 text-brand-500" />
                             <span className="text-xs font-bold text-gray-500 uppercase">Latest Updates</span>
                          </div>
                          <ul className="list-disc list-inside space-y-1">
                              {org.announcements.map((ann, i) => (
                                  <li key={i} className="text-xs text-gray-700 leading-snug">{ann}</li>
                              ))}
                          </ul>
                      </div>
                  )}
              </Card>
          ))}
          {filteredOrgs.length === 0 && (
              <div className="col-span-full text-center py-16">
                  <div className="bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-white/50" />
                  </div>
                  <p className="text-white/60 font-medium">No organizations found in this category.</p>
              </div>
          )}
      </div>
    </div>
  );
};

export default Organizations;
