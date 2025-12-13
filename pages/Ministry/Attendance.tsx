import React, { useState } from 'react';
import { PageHeader, Card, Button } from '../../components/UI';
import { MOCK_USER } from '../../services/mockData';
import { Check, X, Save, Calendar, Users } from 'lucide-react';

// Mock Roster Data
const INITIAL_ROSTER = [
    { id: 'm1', name: 'John Doe', present: false, note: '' },
    { id: 'm2', name: 'Jane Smith', present: true, note: '' },
    { id: 'm3', name: 'Robert Johnson', present: false, note: 'Sick' },
    { id: 'm4', name: 'Emily Davis', present: false, note: '' },
    { id: 'm5', name: 'Michael Brown', present: true, note: '' },
];

const Attendance: React.FC = () => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [roster, setRoster] = useState(INITIAL_ROSTER);
  const [submitted, setSubmitted] = useState(false);

  const togglePresent = (id: string) => {
    setRoster(roster.map(m => m.id === id ? { ...m, present: !m.present } : m));
  };

  const updateNote = (id: string, note: string) => {
    setRoster(roster.map(m => m.id === id ? { ...m, note } : m));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
  };

  return (
    <div>
      <PageHeader title="Class Attendance" />
      
      <Card className="mb-6 p-4 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
             <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                    <Calendar className="w-5 h-5 text-slate-500" />
                </div>
                <input 
                  type="date" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)}
                  className="bg-transparent font-semibold text-gray-900 dark:text-white outline-none"
                />
             </div>
             <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                <Users className="w-4 h-4 text-slate-500" />
                <span className="font-medium text-sm text-gray-700 dark:text-gray-300">{MOCK_USER.className || 'Class 1'}</span>
             </div>
          </div>
      </Card>

      <div className="flex justify-between items-center mb-4 px-1">
         <span className="font-bold text-gray-500 text-sm uppercase tracking-wider">Members List</span>
         <span className="text-xs font-bold bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-600 dark:text-slate-400">
             {roster.filter(r => r.present).length} / {roster.length} Present
         </span>
      </div>

      <div className="space-y-3">
          {roster.map(member => (
              <div 
                key={member.id} 
                className={`bg-white dark:bg-slate-900 rounded-xl shadow-native border p-4 transition-all ${
                    member.present 
                    ? 'border-green-500/50 bg-green-50/10 dark:bg-green-900/10' 
                    : 'border-gray-200 dark:border-gray-800'
                }`}
              >
                  <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                             member.present 
                             ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
                             : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                          }`}>
                              {member.name.substring(0,2).toUpperCase()}
                          </div>
                          <div>
                              <div className="font-bold text-gray-900 dark:text-white">{member.name}</div>
                              <div className={`text-xs font-medium ${member.present ? 'text-green-600' : 'text-gray-400'}`}>
                                  {member.present ? 'Present' : 'Absent'}
                              </div>
                          </div>
                      </div>

                      <button 
                          onClick={() => togglePresent(member.id)}
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-90 shadow-sm ${
                              member.present 
                              ? 'bg-green-600 text-white shadow-green-200' 
                              : 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 text-gray-400'
                          }`}
                      >
                          {member.present ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                      </button>
                  </div>
                  
                  <div className="relative mt-2">
                      <input 
                        type="text" 
                        placeholder="Add optional note..." 
                        value={member.note}
                        onChange={(e) => updateNote(member.id, e.target.value)}
                        className="w-full bg-transparent border-b border-gray-100 dark:border-gray-800 focus:border-slate-500 focus:outline-none text-sm py-2 px-1 placeholder-gray-400 dark:text-gray-300 transition-colors"
                      />
                  </div>
              </div>
          ))}
      </div>

      <div className="mt-8 flex justify-end sticky bottom-6 z-10">
        <Button 
            onClick={handleSubmit} 
            disabled={submitted} 
            className="w-full md:w-auto gap-2 shadow-xl bg-slate-800 hover:bg-slate-900 text-white"
        >
            <Save className="w-5 h-5 md:w-4 md:h-4" /> 
            {submitted ? 'Saved' : 'Save Record'}
        </Button>
      </div>
    </div>
  );
};

export default Attendance;