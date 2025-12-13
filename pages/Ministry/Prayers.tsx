import React, { useEffect, useState } from 'react';
import { AdminService } from '../../services/api';
import { PrayerRequest } from '../../types';
import { PageHeader, LoadingScreen, Card, Badge, Button } from '../../components/UI';
import { Lock, Unlock, MessageCircle, CheckCircle, Clock } from 'lucide-react';

const Prayers: React.FC = () => {
  const [requests, setRequests] = useState<PrayerRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AdminService.getPrayerRequests().then(data => {
      setRequests(data);
      setLoading(false);
    });
  }, []);

  const handleStatusChange = async (id: string, newStatus: PrayerRequest['status']) => {
      setRequests(reqs => reqs.map(r => r.id === id ? { ...r, status: newStatus } : r));
      await AdminService.updatePrayerStatus(id, newStatus);
  };

  if (loading) return <LoadingScreen />;

  return (
    <div>
      <PageHeader title="Prayer Requests" />

      <div className="space-y-4">
        {requests.map(req => (
            <Card key={req.id} className="p-6 border-l-4 border-l-rose-500">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${req.isAnonymous ? 'bg-gray-100 text-gray-500' : 'bg-rose-50 text-rose-600'}`}>
                            {req.isAnonymous ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
                        </div>
                        <div>
                            <span className="font-bold text-gray-900 dark:text-white block">
                                {req.isAnonymous ? 'Anonymous Request' : req.requesterName}
                            </span>
                            <span className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                <Clock className="w-3 h-3" /> {new Date(req.date).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                    <Badge color={req.status === 'New' ? 'red' : req.status === 'In-Progress' ? 'yellow' : 'green'}>
                        {req.status}
                    </Badge>
                </div>
                
                <div className="text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-slate-800/50 p-4 rounded-xl mb-5 text-sm leading-relaxed border border-gray-100 dark:border-gray-800">
                    "{req.content}"
                </div>

                <div className="flex gap-2 justify-end">
                    {req.status !== 'In-Progress' && (
                        <Button size="sm" variant="outline" onClick={() => handleStatusChange(req.id, 'In-Progress')} className="gap-2">
                            <MessageCircle className="w-4 h-4" /> Start
                        </Button>
                    )}
                    {req.status !== 'Closed' && (
                        <Button size="sm" variant="outline" onClick={() => handleStatusChange(req.id, 'Closed')} className="gap-2 text-green-700 border-green-200 hover:bg-green-50">
                            <CheckCircle className="w-4 h-4" /> Close
                        </Button>
                    )}
                </div>
            </Card>
        ))}
      </div>
    </div>
  );
};

export default Prayers;