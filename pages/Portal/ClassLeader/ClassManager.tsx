import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { ClassService } from '../../../services/api';
import { Member } from '../../../types';
import { PageHeader, Card, Button, Badge, LoadingScreen } from '../../../components/UI';
import { Search, CheckCircle, XCircle, Save, Calendar, Users } from 'lucide-react';

const ClassManager: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'members' | 'attendance'>('members');
  const [members, setMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Attendance State
  const [attDate, setAttDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState<Record<string, { present: boolean; note: string }>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (user?.classId) {
      ClassService.getMembers(user.classId).then(data => {
        setMembers(data);
        // Initialize attendance state
        const initialAtt: any = {};
        data.forEach(m => initialAtt[m.id] = { present: false, note: '' });
        setAttendance(initialAtt);
        setLoading(false);
      });
    }
  }, [user]);

  const filteredMembers = members.filter(m => 
    m.fullName.toLowerCase().includes(search.toLowerCase()) || 
    m.classNumber.includes(search)
  );

  const togglePresence = (id: string) => {
    setAttendance(prev => ({
      ...prev,
      [id]: { ...prev[id], present: !prev[id].present }
    }));
  };

  const updateNote = (id: string, note: string) => {
    setAttendance(prev => ({
      ...prev,
      [id]: { ...prev[id], note }
    }));
  };

  const submitAttendance = async () => {
    if (!user?.classId) return;
    setLoading(true);
    
    const attendees = members.map(m => ({
        memberId: m.id,
        present: attendance[m.id]?.present || false,
        note: attendance[m.id]?.note
    }));

    await ClassService.submitAttendance({
        date: attDate,
        classId: user.classId,
        leaderId: user.id,
        attendees
    });

    setLoading(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  if (!user?.classId) return <div className="p-8 text-center text-gray-500">You are not assigned to a class.</div>;
  if (loading) return <LoadingScreen />;

  return (
    <div>
      <PageHeader title={`Class ${user.className} Manager`} />

      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button 
          onClick={() => setActiveTab('members')}
          className={`px-6 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'members' ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          <Users className="w-4 h-4" /> Members
        </button>
        <button 
          onClick={() => setActiveTab('attendance')}
          className={`px-6 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'attendance' ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          <Calendar className="w-4 h-4" /> Attendance
        </button>
      </div>

      {activeTab === 'members' && (
        <div className="space-y-4">
           <div className="relative">
             <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
             <input 
               type="text" 
               placeholder="Search name or number (e.g. 001)..."
               className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
               value={search}
               onChange={e => setSearch(e.target.value)}
             />
           </div>
           
           <div className="grid gap-3">
             {filteredMembers.map(member => (
               <Card key={member.id} className="p-4 flex justify-between items-center">
                 <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm">
                     {member.classNumber}
                   </div>
                   <div>
                     <h3 className="font-bold text-gray-900">{member.fullName}</h3>
                     <p className="text-xs text-gray-500">{member.phone}</p>
                   </div>
                 </div>
                 <Badge color={member.status === 'Active' ? 'green' : 'gray'}>{member.status}</Badge>
               </Card>
             ))}
           </div>
        </div>
      )}

      {activeTab === 'attendance' && (
        <div className="space-y-4">
           <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl mb-4">
              <label className="font-medium text-gray-700">Date:</label>
              <input 
                type="date" 
                value={attDate}
                onChange={e => setAttDate(e.target.value)}
                className="border-gray-300 border rounded-md p-2"
              />
           </div>

           <div className="space-y-3">
             {members.map(member => {
               const isPresent = attendance[member.id]?.present;
               return (
                 <div key={member.id} className={`bg-white border rounded-xl p-4 transition-colors ${isPresent ? 'border-green-200 bg-green-50/20' : 'border-gray-200'}`}>
                    <div className="flex justify-between items-start mb-3">
                       <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-gray-400">#{member.classNumber}</span>
                          <span className="font-bold text-gray-900">{member.fullName}</span>
                       </div>
                       <button 
                         onClick={() => togglePresence(member.id)}
                         className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${isPresent ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                       >
                         {isPresent ? <><CheckCircle className="w-4 h-4" /> Present</> : <><XCircle className="w-4 h-4" /> Absent</>}
                       </button>
                    </div>
                    <input 
                      type="text" 
                      placeholder="Add note (e.g. Sick)..."
                      className="w-full text-sm bg-transparent border-b border-gray-200 focus:border-brand-500 focus:outline-none py-1"
                      value={attendance[member.id]?.note || ''}
                      onChange={e => updateNote(member.id, e.target.value)}
                    />
                 </div>
               )
             })}
           </div>

           <div className="sticky bottom-6 flex justify-end">
              <Button onClick={submitAttendance} className="shadow-xl gap-2" disabled={submitted}>
                 <Save className="w-4 h-4" /> {submitted ? 'Saved Successfully' : 'Submit Attendance'}
              </Button>
           </div>
        </div>
      )}
    </div>
  );
};

export default ClassManager;