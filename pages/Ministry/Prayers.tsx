import React, { useEffect, useState } from 'react';
import { AdminService } from '../../services/api';
import { PrayerRequest } from '../../types';
import { PageHeader, LoadingScreen, Card, Badge, Button } from '../../components/UI';
import { Lock, Unlock, MessageCircle, CheckCircle } from 'lucide-react';

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
      // Optimistic update
      setRequests(reqs => reqs.map(r => r.id === id ? { ...r, status: newStatus } : r));
      await AdminService.updatePrayerStatus(id, newStatus);
  };

  if (loading) return <LoadingScreen />;

  return (
    <div>
      <PageHeader title="Prayer Requests" />

      <div className="space-y-4">
        {requests.map(req => (
            <Card key={req.id} className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                        {req.isAnonymous ? <Lock className="w-4 h-4 text-orange-500" /> : <Unlock className="w-4 h-4 text-gray-400" />}
                        <span className="font-bold text-gray-900">{req.isAnonymous ? 'Anonymous Request' : req.requesterName}</span>
                        {req.isAnonymous && <span className="text-xs text-gray-500">({req.requesterName})</span>}
                    </div>
                    <Badge color={req.status === 'New' ? 'blue' : req.status === 'In-Progress' ? 'yellow' : 'green'}>
                        {req.status}
                    </Badge>
                </div>
                
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg my-3 border border-gray-100">{req.content}</p>
                <div className="text-xs text-gray-400 mb-4">{new Date(req.date).toLocaleDateString()}</div>

                <div className="flex gap-2 border-t pt-4">
                    {req.status !== 'In-Progress' && (
                        <Button size="sm" variant="outline" onClick={() => handleStatusChange(req.id, 'In-Progress')} className="gap-2">
                            <MessageCircle className="w-4 h-4" /> Mark In-Progress
                        </Button>
                    )}
                    {req.status !== 'Closed' && (
                        <Button size="sm" variant="outline" onClick={() => handleStatusChange(req.id, 'Closed')} className="gap-2 text-green-700 hover:text-green-800">
                            <CheckCircle className="w-4 h-4" /> Close Request
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