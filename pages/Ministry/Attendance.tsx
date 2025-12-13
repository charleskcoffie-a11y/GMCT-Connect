import React, { useState } from 'react';
import { PageHeader, Card, Button, Badge } from '../../components/UI';
import { MOCK_USER } from '../../services/mockData';
import { Check, X, Save } from 'lucide-react';

// Mock Roster Data Local to Component for simplicity
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
    // In real app, API call here
    setTimeout(() => setSubmitted(false), 2000);
  };

  return (
    <div>
      <PageHeader title="Class Attendance" />
      
      <div className="mb-6 space-y-4 md:flex md:space-y-0 md:space-x-4 md:items-end">
          <div className="w-full md:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input 
                  type="date" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full md:w-48 border rounded-lg px-3 py-2 bg-white shadow-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
          </div>
          <div className="w-full md:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
              <div className="w-full md:w-auto px-4 py-2 bg-white border shadow-sm rounded-lg text-gray-700 font-medium">{MOCK_USER.className || 'Class 1'}</div>
          </div>
          
          <div className="flex-1 text-right hidden md:block">
              <span className="text-sm text-gray-500 mr-2">
                Present: {roster.filter(r => r.present).length}/{roster.length}
              </span>
          </div>
      </div>

      <div className="flex justify-between items-center md:hidden mb-4 px-1">
         <span className="font-bold text-gray-700">Roster</span>
         <span className="text-sm bg-gray-100 px-2 py-1 rounded text-gray-600">
             {roster.filter(r => r.present).length} / {roster.length} Present
         </span>
      </div>

      {/* Mobile-First Card List Layout */}
      <div className="space-y-3">
          {roster.map(member => (
              <div 
                key={member.id} 
                className={`bg-white rounded-xl shadow-sm border p-4 transition-all ${
                    member.present ? 'border-green-200 bg-green-50/30' : 'border-gray-200'
                }`}
              >
                  <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                             member.present ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                          }`}>
                              {member.name.substring(0,2).toUpperCase()}
                          </div>
                          <div>
                              <div className="font-bold text-gray-900">{member.name}</div>
                              <div className="text-xs text-gray-500">{member.present ? 'Present' : 'Absent'}</div>
                          </div>
                      </div>

                      <button 
                          onClick={() => togglePresent(member.id)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                              member.present 
                              ? 'bg-green-600 text-white shadow-md' 
                              : 'bg-white border border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                      >
                          {member.present ? (
                              <>
                                <Check className="w-5 h-5" />
                                <span className="hidden sm:inline">Present</span>
                              </>
                          ) : (
                              <>
                                <X className="w-5 h-5" />
                                <span className="hidden sm:inline">Absent</span>
                              </>
                          )}
                      </button>
                  </div>
                  
                  {/* Note Input Area */}
                  <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Add optional note (e.g. Sick, Travel)..." 
                        value={member.note}
                        onChange={(e) => updateNote(member.id, e.target.value)}
                        className="w-full bg-transparent border-b border-gray-200 focus:border-brand-500 focus:outline-none text-sm py-2 px-1 placeholder-gray-400"
                      />
                  </div>
              </div>
          ))}
      </div>

      {/* Floating Action Button for Mobile or Regular Button for Desktop */}
      <div className="mt-8 flex justify-end sticky bottom-6 z-10">
        <Button 
            onClick={handleSubmit} 
            disabled={submitted} 
            className="w-full md:w-auto gap-2 shadow-lg py-3 md:py-2 text-lg md:text-sm"
        >
            <Save className="w-5 h-5 md:w-4 md:h-4" /> 
            {submitted ? 'Attendance Saved' : 'Save Attendance Record'}
        </Button>
      </div>
    </div>
  );
};

export default Attendance;