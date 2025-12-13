import React, { useEffect, useState } from 'react';
import { AdminService } from '../../services/api';
import { SickReport } from '../../types';
import { PageHeader, LoadingScreen, Card, Badge, Button } from '../../components/UI';
import { Plus, User, Calendar } from 'lucide-react';

const SickReports: React.FC = () => {
  const [reports, setReports] = useState<SickReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
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
        action={<Button onClick={() => setShowForm(!showForm)} className="gap-2 shadow-sm bg-slate-700 hover:bg-slate-800"><Plus className="w-4 h-4" /> Report</Button>}
      />

      {showForm && (
          <Card className="mb-8 p-6 bg-white dark:bg-slate-900 border-l-4 border-l-slate-500 shadow-lg">
              <h3 className="font-bold text-lg mb-4 text-slate-800 dark:text-slate-100">Submit New Report</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Member Name</label>
                      <input 
                        required 
                        className="w-full border rounded-lg p-2.5 dark:bg-slate-800 dark:border-slate-700 dark:text-white" 
                        value={formData.memberName}
                        onChange={e => setFormData({...formData, memberName: e.target.value})}
                      />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Condition / Notes</label>
                      <textarea 
                        required 
                        className="w-full border rounded-lg p-2.5 dark:bg-slate-800 dark:border-slate-700 dark:text-white" 
                        rows={3}
                        value={formData.condition}
                        onChange={e => setFormData({...formData, condition: e.target.value})}
                      />
                  </div>
                  <div>
                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Urgency</label>
                       <select 
                            className="w-full border rounded-lg p-2.5 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                            value={formData.urgency}
                            onChange={e => setFormData({...formData, urgency: e.target.value as any})}
                        >
                           <option value="Low">Low - Info only</option>
                           <option value="Medium">Medium - Visit required soon</option>
                           <option value="High">High - Immediate attention</option>
                       </select>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                      <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
                      <Button type="submit" className="bg-slate-700 hover:bg-slate-800">Submit Report</Button>
                  </div>
              </form>
          </Card>
      )}

      {loading ? <LoadingScreen /> : (
          <div className="grid gap-4">
              {reports.map(report => (
                  <Card key={report.id} className="p-5 flex flex-col justify-between gap-4 border-l-4 border-l-slate-500">
                      <div>
                          <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center gap-3">
                                  <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-full">
                                      <User className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                                  </div>
                                  <div>
                                      <span className="font-bold text-lg text-gray-900 dark:text-white block">{report.memberName}</span>
                                      <span className="text-xs text-gray-500 flex items-center gap-1">
                                          <Calendar className="w-3 h-3" /> {new Date(report.date).toLocaleDateString()}
                                      </span>
                                  </div>
                              </div>
                              <Badge color={report.urgency === 'High' ? 'red' : report.urgency === 'Medium' ? 'yellow' : 'gray'}>
                                  {report.urgency}
                              </Badge>
                          </div>
                          <div className="mt-3 pl-12">
                              <p className="text-gray-700 dark:text-gray-300 leading-relaxed bg-slate-50 dark:bg-slate-800/30 p-3 rounded-lg border border-slate-100 dark:border-slate-800 text-sm">
                                  {report.condition}
                              </p>
                          </div>
                      </div>
                      <div className="flex justify-end pl-12">
                          <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${
                              report.status === 'Resolved' ? 'border-green-200 text-green-700 bg-green-50' : 
                              report.status === 'Visited' ? 'border-blue-200 text-blue-700 bg-blue-50' : 
                              'border-slate-200 text-slate-600 bg-slate-50'
                          }`}>
                              Status: {report.status}
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