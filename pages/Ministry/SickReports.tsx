import React, { useEffect, useState } from 'react';
import { AdminService } from '../../services/api';
import { SickReport } from '../../types';
import { PageHeader, LoadingScreen, Card, Badge, Button } from '../../components/UI';
import { AlertCircle, Plus } from 'lucide-react';

const SickReports: React.FC = () => {
  const [reports, setReports] = useState<SickReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({ memberName: '', condition: '', urgency: 'Low' as 'Low' | 'Medium' | 'High' });

  useEffect(() => {
    AdminService.getSickReports().then(data => {
      setReports(data);
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await AdminService.submitSickReport(formData);
    const data = await AdminService.getSickReports();
    setReports(data);
    setLoading(false);
    setShowForm(false);
    setFormData({ memberName: '', condition: '', urgency: 'Low' });
  };

  return (
    <div>
      <PageHeader 
        title="Sick Reports" 
        action={<Button onClick={() => setShowForm(!showForm)} className="gap-2"><Plus className="w-4 h-4" /> Report Member</Button>}
      />

      {showForm && (
          <Card className="mb-8 p-6 bg-brand-50 border-brand-200">
              <h3 className="font-bold text-lg mb-4">Submit New Report</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Member Name</label>
                      <input 
                        required 
                        className="w-full border rounded p-2" 
                        value={formData.memberName}
                        onChange={e => setFormData({...formData, memberName: e.target.value})}
                      />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Condition / Notes</label>
                      <textarea 
                        required 
                        className="w-full border rounded p-2" 
                        rows={3}
                        value={formData.condition}
                        onChange={e => setFormData({...formData, condition: e.target.value})}
                      />
                  </div>
                  <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Urgency</label>
                       <select 
                            className="w-full border rounded p-2"
                            value={formData.urgency}
                            onChange={e => setFormData({...formData, urgency: e.target.value as any})}
                        >
                           <option value="Low">Low - Info only</option>
                           <option value="Medium">Medium - Visit required soon</option>
                           <option value="High">High - Immediate attention</option>
                       </select>
                  </div>
                  <div className="flex justify-end gap-2">
                      <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
                      <Button type="submit">Submit Report</Button>
                  </div>
              </form>
          </Card>
      )}

      {loading ? <LoadingScreen /> : (
          <div className="grid gap-4">
              {reports.map(report => (
                  <Card key={report.id} className="p-4 flex flex-col md:flex-row justify-between md:items-center gap-4">
                      <div>
                          <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-lg">{report.memberName}</span>
                              <Badge color={report.urgency === 'High' ? 'red' : report.urgency === 'Medium' ? 'yellow' : 'blue'}>
                                  {report.urgency} Priority
                              </Badge>
                          </div>
                          <p className="text-gray-600">{report.condition}</p>
                          <div className="text-xs text-gray-400 mt-2">Reported on {new Date(report.date).toLocaleDateString()}</div>
                      </div>
                      <div className="flex items-center gap-2">
                          <span className={`text-sm font-medium px-3 py-1 rounded-full border ${
                              report.status === 'Resolved' ? 'border-green-200 text-green-700 bg-green-50' : 
                              report.status === 'Visited' ? 'border-blue-200 text-blue-700 bg-blue-50' : 
                              'border-gray-200 text-gray-600'
                          }`}>
                              {report.status}
                          </span>
                      </div>
                  </Card>
              ))}
          </div>
      )}
    </div>
  );
};

export default SickReports;
