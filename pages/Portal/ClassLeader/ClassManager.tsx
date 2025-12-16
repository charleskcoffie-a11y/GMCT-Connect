
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { ClassService } from '../../../services/api';
import { Member, ClassMessage, AttendanceStatus, DayType, AttendanceRecord } from '../../../types';
import { PageHeader, Card, Button, Badge, LoadingScreen, MultiSelectListBox } from '../../../components/UI';
import { Search, CheckCircle, XCircle, Save, Calendar, Users, Lock, Send, MessageSquare, Mail, Check, AlertTriangle, Plane, Stethoscope, ClipboardList, BarChart2, RefreshCw, History, Edit2, ChevronRight, Download } from 'lucide-react';

const ClassManager: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'members' | 'attendance' | 'history' | 'analytics' | 'followup' | 'reports' | 'inbox'>('members');
  const [members, setMembers] = useState<Member[]>([]);
  const [followUpList, setFollowUpList] = useState<Member[]>([]);
  const [messages, setMessages] = useState<ClassMessage[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Access Verification State
  const [needsAccess, setNeedsAccess] = useState(false);
  const [accessClassId, setAccessClassId] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [verifying, setVerifying] = useState(false);

  // Attendance State
  const [attDate, setAttDate] = useState(new Date().toISOString().split('T')[0]);
  const [dayType, setDayType] = useState<DayType>('Sunday');
  const [submitted, setSubmitted] = useState(false);
  
  // Bulk Selection State
  const [presentIds, setPresentIds] = useState<string[]>([]);
  const [sickIds, setSickIds] = useState<string[]>([]);
  const [travelledIds, setTravelledIds] = useState<string[]>([]);

  // Analytics/History State
  const [history, setHistory] = useState<AttendanceRecord[]>([]);
  const [analyticsRange, setAnalyticsRange] = useState<'4weeks' | '2weeks' | 'all'>('4weeks');

  // Leader Note State
  const [noteMember, setNoteMember] = useState<Member | null>(null);
  const [noteMessage, setNoteMessage] = useState('');
  const [noteSending, setNoteSending] = useState(false);

  // Reports State (Auto-flagged members for 30+ and 90+ days)
  const [flaggedThirty, setFlaggedThirty] = useState<Member[]>([]);
  const [flaggedNinety, setFlaggedNinety] = useState<Member[]>([]);
  const [selectedThirty, setSelectedThirty] = useState<string[]>([]);
  const [selectedNinety, setSelectedNinety] = useState<string[]>([]);
  const [reportSending, setReportSending] = useState(false);
  const [smsNotifyEnabled, setSmsNotifyEnabled] = useState(false);

  useEffect(() => {
    if (user?.role === 'class_leader' && !user.classId) {
        setNeedsAccess(true);
        setLoading(false);
    } else if (user?.classId) {
        loadInitialData();
    } else {
        setLoading(false); 
    }
  }, [user]);

  // Refetch attendance when Date or DayType changes
  useEffect(() => {
      if (user?.classId && activeTab === 'attendance') {
          loadAttendanceForDate(attDate, dayType);
      }
  }, [attDate, dayType, activeTab]);

  // Fetch history when Analytics or History tab is active
  useEffect(() => {
      if (user?.classId && (activeTab === 'analytics' || activeTab === 'history')) {
          loadHistory();
      }
  }, [activeTab, analyticsRange]);

  // Calculate flagged members when Reports tab is active
  useEffect(() => {
      if (user?.classId && activeTab === 'reports') {
          calculateFlaggedMembers();
      }
  }, [activeTab]);

  const loadInitialData = async () => {
      if (!user?.classId) return;
      const [mArgs, msgArgs, fuArgs] = await Promise.all([
        ClassService.getMembers(user.classId),
        ClassService.getClassMessages(user.classId),
        ClassService.getFollowUpMembers(user.classId)
      ]);
      setMembers(mArgs);
      setMessages(msgArgs);
      setFollowUpList(fuArgs);
      
      // Determine day type
      const today = new Date().getDay(); 
      if (today === 2) setDayType('Tuesday');
      else setDayType('Sunday');

      setLoading(false);
  };

  const loadAttendanceForDate = async (date: string, type: DayType) => {
      if (!user?.classId) return;
      
      // Default everyone to Absent (empty selection lists)
      setPresentIds([]);
      setSickIds([]);
      setTravelledIds([]);
      
      const record = await ClassService.getAttendanceForDate(user.classId, date, type);
      
      if (record) {
          const present: string[] = [];
          const sick: string[] = [];
          const travelled: string[] = [];
          
          record.records.forEach(r => {
              if (r.status === 'Present') present.push(r.memberId);
              else if (r.status === 'Sick') sick.push(r.memberId);
              else if (r.status === 'Travelled') travelled.push(r.memberId);
          });
          
          setPresentIds(present);
          setSickIds(sick);
          setTravelledIds(travelled);
      }
  };

  const loadHistory = async () => {
      if (!user?.classId) return;
      let startDate: string | undefined = undefined;
      
      // Apply filters only for Analytics to keep charts relevant. 
      // For History tab, we fetch all (or default limit handled by service).
      if (activeTab === 'analytics') {
          const now = new Date();
          if (analyticsRange === '4weeks') {
              now.setDate(now.getDate() - 28);
              startDate = now.toISOString().split('T')[0];
          } else if (analyticsRange === '2weeks') {
              now.setDate(now.getDate() - 14);
              startDate = now.toISOString().split('T')[0];
          }
      }

      const records = await ClassService.getAttendanceHistory(user.classId, startDate);
      setHistory(records);
  };

  const handleVerifyAccess = async (e: React.FormEvent) => {
      e.preventDefault();
      setVerifying(true);
      const result = await ClassService.verifyClassAccess(accessClassId, accessCode);
      setVerifying(false);
      
      if (result.success) {
          alert("Access Granted! Please refresh the page.");
          window.location.reload(); 
      } else {
          alert(result.message);
      }
  };

  const handleSendNote = async () => {
      if (!noteMember || !user?.classId) return;
      setNoteSending(true);
      await ClassService.submitLeaderNote({
          classId: user.classId,
          leaderId: user.id,
          leaderName: user.name,
          memberId: noteMember.id,
          memberName: noteMember.fullName,
          message: noteMessage,
      });
      setNoteSending(false);
      setNoteMember(null);
      setNoteMessage('');
      alert("Note sent to Minister successfully.");
  };

  const handleMarkMessageRead = async (id: string) => {
      await ClassService.markClassMessageRead(id);
      setMessages(messages.map(m => m.id === id ? { ...m, isRead: true } : m));
  };

  const handleEditRecord = (record: AttendanceRecord) => {
      setAttDate(record.date);
      setDayType(record.dayType);
      setActiveTab('attendance');
      // Tab change triggers useEffect which calls loadAttendanceForDate
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredMembers = members.filter(m => 
    m.fullName.toLowerCase().includes(search.toLowerCase()) || 
    m.classNumber.includes(search)
  );

  // --- Bulk Marking Logic (Mutual Exclusivity) ---
  const handlePresentChange = (ids: string[]) => {
      setPresentIds(ids);
      // Remove newly present members from other lists
      setSickIds(prev => prev.filter(id => !ids.includes(id)));
      setTravelledIds(prev => prev.filter(id => !ids.includes(id)));
  };

  const handleSickChange = (ids: string[]) => {
      setSickIds(ids);
      setPresentIds(prev => prev.filter(id => !ids.includes(id)));
      setTravelledIds(prev => prev.filter(id => !ids.includes(id)));
  };

  const handleTravelledChange = (ids: string[]) => {
      setTravelledIds(ids);
      setPresentIds(prev => prev.filter(id => !ids.includes(id)));
      setSickIds(prev => prev.filter(id => !ids.includes(id)));
  };

  const resetToAbsent = () => {
      if(window.confirm('Reset all members to Absent?')) {
          setPresentIds([]);
          setSickIds([]);
          setTravelledIds([]);
      }
  };

  const submitAttendance = async () => {
    if (!user?.classId) return;
    setLoading(true);
    
    // Construct records from selection lists
    const attendees = members.map(m => {
        let status: AttendanceStatus = 'Absent';
        if (presentIds.includes(m.id)) status = 'Present';
        else if (sickIds.includes(m.id)) status = 'Sick';
        else if (travelledIds.includes(m.id)) status = 'Travelled';
        
        return {
            memberId: m.id,
            status: status,
            note: '' 
        };
    });

    await ClassService.submitAttendance({
        date: attDate,
        dayType: dayType,
        classId: user.classId,
        classNumber: user.className || '',
        leaderId: user.id,
        markedByUid: user.id,
        records: attendees
    });

    setLoading(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    
    // Refresh history if we were on history/analytics tab previously
    loadHistory();
  };
  
  const handleFollowUpAction = async (memberId: string, action: 'Sick' | 'Travelled' | 'Resolved') => {
      if (!window.confirm(`Confirm member status as ${action}?`)) return;
      
      setLoading(true);
      await ClassService.resolveFollowUp(memberId, action);
      setFollowUpList(prev => prev.filter(m => m.id !== memberId));
      setLoading(false);
  };

  // Calculate flagged members based on attendance history
  const calculateFlaggedMembers = async () => {
      if (!user?.classId) return;
      
      const records = await ClassService.getAttendanceHistory(user.classId);
      const now = new Date();
      const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
      const ninetyDaysAgo = new Date(now.setDate(now.getDate() - 90));

      const thirty: Set<string> = new Set();
      const ninety: Set<string> = new Set();

      // Mark members as absent if last attendance is before threshold
      members.forEach(member => {
          const lastAttended = member.lastAttended ? new Date(member.lastAttended) : null;
          
          if (!lastAttended || lastAttended < ninetyDaysAgo) {
              ninety.add(member.id);
          } else if (!lastAttended || lastAttended < thirtyDaysAgo) {
              thirty.add(member.id);
          }
      });

      setFlaggedThirty(members.filter(m => thirty.has(m.id)));
      setFlaggedNinety(members.filter(m => ninety.has(m.id)));
      
      // Auto-select all flagged for confirmation
      setSelectedThirty(Array.from(thirty));
      setSelectedNinety(Array.from(ninety));
  };

  // Send flagged members report to Minister and Stewards
  const sendFlaggedReport = async () => {
      if (!user?.classId) return;
      
      const reportMessage = `
Flagged Members Report from ${user.className}

30-Day Absent (Not seen in 30 days):
${selectedThirty.map(id => members.find(m => m.id === id)?.fullName).filter(Boolean).join('\n') || 'None'}

90-Day Absent / See to Meet List (Not seen in 90 days):
${selectedNinety.map(id => members.find(m => m.id === id)?.fullName).filter(Boolean).join('\n') || 'None'}

Total flagged: ${selectedThirty.length + selectedNinety.length} members
Submitted by: ${user.name}
      `.trim();

      setReportSending(true);
      try {
          await AdminService.sendMessageToMinister({
              senderName: user.name,
              phone: user.phoneNumber || '',
              text: reportMessage
          });
          await AdminService.sendMessageToStewards({
              senderName: user.name,
              phone: user.phoneNumber || '',
              text: reportMessage
          });

          // Send SMS if enabled
          if (smsNotifyEnabled) {
              const flaggedNames = [
                  ...selectedThirty.map(id => members.find(m => m.id === id)?.fullName).filter(Boolean),
                  ...selectedNinety.map(id => members.find(m => m.id === id)?.fullName).filter(Boolean)
              ];
              const smsText = `GMCT: Flagged Members Report from ${user.className} - ${flaggedNames.length} members need follow-up. Review in app for details.`;
              
              // Mock SMS to stewards (would be sent via Twilio API in production)
              await AdminService.sendSmsToStewards({
                  senderName: user.name,
                  message: smsText
              });
          }

          alert('Report sent to Rev. Minister and Stewards' + (smsNotifyEnabled ? ' (+ SMS)' : '') + '.');
          setSelectedThirty([]);
          setSelectedNinety([]);
          setSmsNotifyEnabled(false);
      } finally {
          setReportSending(false);
      }
  };

  // Export flagged members as CSV
  const exportAsCSV = () => {
      const headers = ['Name', 'Class Number', 'Phone', 'Last Attended', 'Days Absent'];
      const rows = [
          ...selectedThirty.map(id => {
              const m = members.find(mem => mem.id === id);
              const daysAbsent = m?.lastAttended ? Math.floor((Date.now() - new Date(m.lastAttended).getTime()) / (1000 * 60 * 60 * 24)) : 'Unknown';
              return [m?.fullName, m?.classNumber, m?.phone, m?.lastAttended || 'Never', daysAbsent];
          }),
          ...selectedNinety.map(id => {
              const m = members.find(mem => mem.id === id);
              const daysAbsent = m?.lastAttended ? Math.floor((Date.now() - new Date(m.lastAttended).getTime()) / (1000 * 60 * 60 * 24)) : 'Unknown';
              return [m?.fullName, m?.classNumber, m?.phone, m?.lastAttended || 'Never', daysAbsent];
          })
      ];

      const csv = [
          headers.join(','),
          ...rows.map(r => r.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `flagged-members-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
  };

  const getAnalyticsSummary = () => {
      let totalSessions = history.length;
      let totalPresent = 0;
      let totalSick = 0;
      let totalTravel = 0;
      
      history.forEach(session => {
          session.records.forEach(r => {
              if (r.status === 'Present') totalPresent++;
              if (r.status === 'Sick') totalSick++;
              if (r.status === 'Travelled') totalTravel++;
          });
      });

      const avgPresent = totalSessions ? Math.round(totalPresent / totalSessions) : 0;
      const rate = totalSessions && members.length ? Math.round((totalPresent / (totalSessions * members.length)) * 100) : 0;

      return { totalSessions, avgPresent, totalSick, totalTravel, rate };
  };
  
  const getGridColor = (status: string) => {
      switch(status) {
          case 'Present': return 'bg-green-500';
          case 'Sick': return 'bg-yellow-400';
          case 'Travelled': return 'bg-blue-500';
          default: return 'bg-gray-200';
      }
  };

  const getMemberOptions = () => members.map(m => ({
      value: m.id,
      label: m.fullName,
      subLabel: `#${m.classNumber} • ${m.phone}`
  }));

  if (loading) return <LoadingScreen />;

  // --- ACCESS VERIFICATION SCREEN ---
  if (needsAccess) {
      return (
          <div className="max-w-md mx-auto mt-10">
              <Card className="p-8 text-center border-t-4 border-t-brand-600">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Lock className="w-8 h-8 text-gray-500" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Class Verification</h2>
                  <p className="text-gray-500 text-sm mb-6">Enter your Class ID and the secure Access Code provided by the administrator to manage your class.</p>
                  
                  <form onSubmit={handleVerifyAccess} className="space-y-4 text-left">
                      <div>
                          <label className="text-sm font-bold text-gray-700">Class ID (e.g. c1)</label>
                          <input 
                            required
                            className="w-full border p-3 rounded-lg mt-1" 
                            placeholder="c1"
                            value={accessClassId}
                            onChange={e => setAccessClassId(e.target.value)}
                          />
                      </div>
                      <div>
                          <label className="text-sm font-bold text-gray-700">Access Code</label>
                          <input 
                            required
                            type="password"
                            className="w-full border p-3 rounded-lg mt-1" 
                            placeholder="••••••"
                            value={accessCode}
                            onChange={e => setAccessCode(e.target.value)}
                          />
                      </div>
                      <Button type="submit" isLoading={verifying} className="w-full shadow-lg">Verify Access</Button>
                      <p className="text-xs text-center text-gray-400 mt-2">Mock Code: 1234</p>
                  </form>
              </Card>
          </div>
      );
  }

  if (!user?.classId) return <div className="p-8 text-center text-gray-500">You are not assigned to a class.</div>;

  const stats = getAnalyticsSummary();

  return (
    <div>
      <PageHeader title={`Class ${user.className} Manager`} />

      {/* Tabs */}
      <div className="flex border-b mb-6 overflow-x-auto no-scrollbar">
        <button 
          onClick={() => setActiveTab('members')}
          className={`px-6 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'members' ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          <Users className="w-4 h-4" /> Members
        </button>
        <button 
          onClick={() => setActiveTab('attendance')}
          className={`px-6 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'attendance' ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          <Calendar className="w-4 h-4" /> Attendance
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`px-6 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'history' ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          <History className="w-4 h-4" /> History
        </button>
        <button 
          onClick={() => setActiveTab('analytics')}
          className={`px-6 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'analytics' ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          <BarChart2 className="w-4 h-4" /> Analytics
        </button>
        <button 
          onClick={() => setActiveTab('followup')}
          className={`px-6 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'followup' ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          <ClipboardList className="w-4 h-4" /> Follow-Up
          {followUpList.length > 0 && (
             <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full ml-1">{followUpList.length}</span>
          )}
        </button>
        <button 
          onClick={() => setActiveTab('reports')}
          className={`px-6 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'reports' ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          <BarChart2 className="w-4 h-4" /> Reports
          {(flaggedThirty.length + flaggedNinety.length) > 0 && (
             <span className="bg-orange-500 text-white text-[10px] px-1.5 py-0.5 rounded-full ml-1">{flaggedThirty.length + flaggedNinety.length}</span>
          )}
        </button>
        <button 
          onClick={() => setActiveTab('inbox')}
          className={`px-6 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'inbox' ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          <Mail className="w-4 h-4" /> Inbox
          {messages.filter(m => !m.isRead).length > 0 && (
              <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full ml-1">{messages.filter(m => !m.isRead).length}</span>
          )}
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
               <Card key={member.id} className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                 <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm">
                     {member.classNumber}
                   </div>
                   <div>
                     <h3 className="font-bold text-gray-900">{member.fullName}</h3>
                     <p className="text-xs text-gray-500">{member.phone}</p>
                   </div>
                 </div>
                 <div className="flex items-center gap-3 self-end md:self-auto">
                    <Badge color={member.status === 'Active' ? 'green' : 'gray'}>{member.status}</Badge>
                    <Button size="sm" variant="outline" onClick={() => setNoteMember(member)} className="text-xs gap-1 h-8">
                        <MessageSquare className="w-3 h-3" /> Note to Minister
                    </Button>
                 </div>
               </Card>
             ))}
           </div>
        </div>
      )}

      {/* Note Modal */}
      {noteMember && (
          <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
              <Card className="w-full max-w-md p-6 bg-white animate-in zoom-in-95">
                  <h3 className="font-bold text-lg mb-2">Note regarding {noteMember.fullName}</h3>
                  <p className="text-sm text-gray-500 mb-4">This note will be sent securely to the Minister's dashboard.</p>
                  <textarea 
                    className="w-full border p-3 rounded-lg mb-4 h-32 focus:ring-2 focus:ring-brand-500 outline-none"
                    placeholder="Enter observation, prayer need, or concern..."
                    value={noteMessage}
                    onChange={e => setNoteMessage(e.target.value)}
                  />
                  <div className="flex justify-end gap-2">
                      <Button variant="ghost" onClick={() => setNoteMember(null)}>Cancel</Button>
                      <Button onClick={handleSendNote} isLoading={noteSending} className="gap-2">
                          <Send className="w-4 h-4" /> Send Note
                      </Button>
                  </div>
              </Card>
          </div>
      )}

      {activeTab === 'attendance' && (
        <div className="space-y-6">
           {/* Date & Day Type Controls */}
           <Card className="p-4 bg-gray-50 border-gray-200">
               <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                   <div className="flex items-center gap-2 w-full md:w-auto">
                        <input 
                            type="date" 
                            value={attDate}
                            onChange={e => setAttDate(e.target.value)}
                            className="border-gray-300 border rounded-lg p-2.5 bg-white text-gray-900 focus:ring-2 focus:ring-brand-500 outline-none w-full md:w-auto font-medium"
                        />
                   </div>
                   <div className="flex p-1 bg-white border border-gray-200 rounded-lg w-full md:w-auto shadow-sm">
                        <button 
                            onClick={() => setDayType('Sunday')}
                            className={`flex-1 px-4 py-2 text-sm font-bold uppercase rounded-md transition-all ${dayType === 'Sunday' ? 'bg-brand-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            Sunday
                        </button>
                        <button 
                            onClick={() => setDayType('Tuesday')}
                            className={`flex-1 px-4 py-2 text-sm font-bold uppercase rounded-md transition-all ${dayType === 'Tuesday' ? 'bg-brand-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            Tuesday
                        </button>
                   </div>
               </div>
           </Card>
           
           {/* Filter Indicator */}
           <div className="flex items-center gap-2 bg-blue-50 text-blue-800 px-4 py-2 rounded-lg text-sm border border-blue-100">
               <Users className="w-4 h-4" />
               <span className="font-semibold">Showing {members.length} members from {user.className}</span>
           </div>

           {/* Bulk Marking UI */}
           <div className="space-y-4">
              {/* Full Width for Present (Most common action) */}
              <div className="border-l-4 border-l-green-500 rounded-xl shadow-sm overflow-hidden">
                  <MultiSelectListBox 
                      label="Select Present Members"
                      options={getMemberOptions()}
                      selectedValues={presentIds}
                      onChange={handlePresentChange}
                      colorTheme="green"
                      height="h-64"
                  />
              </div>

              {/* Grid for Exceptions */}
              <div className="grid md:grid-cols-2 gap-4">
                  <div className="border-l-4 border-l-yellow-400 rounded-xl shadow-sm overflow-hidden">
                      <MultiSelectListBox 
                          label="Select Sick Members"
                          options={getMemberOptions()}
                          selectedValues={sickIds}
                          onChange={handleSickChange}
                          colorTheme="yellow"
                          height="h-48"
                      />
                  </div>
                  <div className="border-l-4 border-l-blue-500 rounded-xl shadow-sm overflow-hidden">
                      <MultiSelectListBox 
                          label="Select Travelled Members"
                          options={getMemberOptions()}
                          selectedValues={travelledIds}
                          onChange={handleTravelledChange}
                          colorTheme="blue"
                          height="h-48"
                      />
                  </div>
              </div>
           </div>

           {/* Review & Summary */}
           <Card className="p-5 bg-white">
               <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                   <ClipboardList className="w-5 h-5 text-gray-500" /> Review Summary
               </h3>
               
               <div className="space-y-4">
                   <div className="flex items-start justify-between p-3 bg-green-50 rounded-lg border border-green-100">
                       <div>
                           <span className="font-bold text-green-800 block mb-1">Present</span>
                           <div className="text-xs text-green-700 leading-relaxed">
                               {presentIds.length > 0 ? presentIds.map(id => members.find(m => m.id === id)?.fullName).join(', ') : 'None selected'}
                           </div>
                       </div>
                       <span className="bg-white text-green-700 px-2 py-1 rounded font-bold text-xs border border-green-200">{presentIds.length}</span>
                   </div>

                   <div className="flex items-start justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                       <div>
                           <span className="font-bold text-yellow-800 block mb-1">Sick</span>
                           <div className="text-xs text-yellow-700 leading-relaxed">
                               {sickIds.length > 0 ? sickIds.map(id => members.find(m => m.id === id)?.fullName).join(', ') : 'None selected'}
                           </div>
                       </div>
                       <span className="bg-white text-yellow-700 px-2 py-1 rounded font-bold text-xs border border-yellow-200">{sickIds.length}</span>
                   </div>

                   <div className="flex items-start justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
                       <div>
                           <span className="font-bold text-blue-800 block mb-1">Travelled</span>
                           <div className="text-xs text-blue-700 leading-relaxed">
                               {travelledIds.length > 0 ? travelledIds.map(id => members.find(m => m.id === id)?.fullName).join(', ') : 'None selected'}
                           </div>
                       </div>
                       <span className="bg-white text-blue-700 px-2 py-1 rounded font-bold text-xs border border-blue-200">{travelledIds.length}</span>
                   </div>

                   <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                       <span className="font-bold text-gray-600">Absent (Default)</span>
                       <span className="bg-white text-gray-700 px-2 py-1 rounded font-bold text-xs border border-gray-200">
                           {members.length - presentIds.length - sickIds.length - travelledIds.length}
                       </span>
                   </div>
               </div>
               
               <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                   <Button variant="ghost" size="sm" onClick={resetToAbsent} className="text-red-500 hover:bg-red-50 gap-2">
                       <RefreshCw className="w-4 h-4" /> Reset All
                   </Button>
               </div>
           </Card>

           <div className="sticky bottom-6 flex justify-end">
              <Button onClick={submitAttendance} className="shadow-xl gap-2 w-full md:w-auto" disabled={submitted}>
                 <Save className="w-4 h-4" /> {submitted ? 'Saved Successfully' : 'Submit Attendance'}
              </Button>
           </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-4">
            {history.length === 0 && (
                <div className="text-center py-12 bg-white border border-gray-200 rounded-xl">
                    <History className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                    <h3 className="font-bold text-gray-900">No History Found</h3>
                    <p className="text-gray-500 text-sm">Submitted attendance records will appear here.</p>
                </div>
            )}
            
            {history.map(record => {
                const presentCount = record.records.filter(r => r.status === 'Present').length;
                const sickCount = record.records.filter(r => r.status === 'Sick').length;
                const travelledCount = record.records.filter(r => r.status === 'Travelled').length;
                const absentCount = members.length - presentCount - sickCount - travelledCount;
                
                return (
                    <Card key={record.id} className="p-5 hover:border-brand-300 transition-colors group">
                        <div className="flex justify-between items-start mb-4">
                             <div>
                                 <div className="flex items-center gap-2">
                                    <h3 className="text-lg font-bold text-gray-900">{new Date(record.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
                                    <Badge color={record.dayType === 'Sunday' ? 'blue' : 'purple'}>{record.dayType}</Badge>
                                 </div>
                                 <p className="text-xs text-gray-500 mt-1">Submitted {new Date(record.createdAt).toLocaleString()}</p>
                             </div>
                             <Button size="sm" variant="outline" onClick={() => handleEditRecord(record)} className="gap-2">
                                 <Edit2 className="w-3 h-3" /> Edit
                             </Button>
                        </div>
                        
                        <div className="grid grid-cols-4 gap-2 text-center text-xs">
                             <div className="bg-green-50 p-2 rounded border border-green-100">
                                 <span className="block font-bold text-lg text-green-700">{presentCount}</span>
                                 <span className="text-green-600">Present</span>
                             </div>
                             <div className="bg-yellow-50 p-2 rounded border border-yellow-100">
                                 <span className="block font-bold text-lg text-yellow-700">{sickCount}</span>
                                 <span className="text-yellow-600">Sick</span>
                             </div>
                             <div className="bg-blue-50 p-2 rounded border border-blue-100">
                                 <span className="block font-bold text-lg text-blue-700">{travelledCount}</span>
                                 <span className="text-blue-600">Travel</span>
                             </div>
                             <div className="bg-gray-50 p-2 rounded border border-gray-200">
                                 <span className="block font-bold text-lg text-gray-600">{absentCount}</span>
                                 <span className="text-gray-500">Absent</span>
                             </div>
                        </div>
                    </Card>
                );
            })}
        </div>
      )}

      {activeTab === 'analytics' && (
          <div className="space-y-6">
              {/* Controls */}
              <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <span className="text-sm font-bold text-gray-600">Range:</span>
                  <div className="flex gap-2">
                      <button onClick={() => setAnalyticsRange('2weeks')} className={`px-3 py-1 rounded-md text-xs font-medium ${analyticsRange === '2weeks' ? 'bg-white shadow text-brand-600' : 'text-gray-500'}`}>2 Weeks</button>
                      <button onClick={() => setAnalyticsRange('4weeks')} className={`px-3 py-1 rounded-md text-xs font-medium ${analyticsRange === '4weeks' ? 'bg-white shadow text-brand-600' : 'text-gray-500'}`}>4 Weeks</button>
                  </div>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Card className="p-4 bg-white border border-gray-200">
                      <span className="text-xs text-gray-400 uppercase font-bold">Total Sessions</span>
                      <div className="text-2xl font-bold text-gray-900 mt-1">{stats.totalSessions}</div>
                  </Card>
                  <Card className="p-4 bg-white border border-gray-200">
                      <span className="text-xs text-gray-400 uppercase font-bold">Avg Present</span>
                      <div className="text-2xl font-bold text-green-600 mt-1">{stats.avgPresent}</div>
                  </Card>
                   <Card className="p-4 bg-white border border-gray-200">
                      <span className="text-xs text-gray-400 uppercase font-bold">Attendance Rate</span>
                      <div className="text-2xl font-bold text-blue-600 mt-1">{stats.rate}%</div>
                  </Card>
                   <Card className="p-4 bg-white border border-gray-200">
                      <span className="text-xs text-gray-400 uppercase font-bold">Total Sick</span>
                      <div className="text-2xl font-bold text-yellow-600 mt-1">{stats.totalSick}</div>
                  </Card>
              </div>

              {/* Grid View */}
              <Card className="p-0 overflow-hidden border border-gray-200">
                  <div className="p-4 bg-gray-50 border-b border-gray-200 font-bold text-gray-700 text-sm">Attendance Grid</div>
                  <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                          <thead>
                              <tr className="bg-gray-50 border-b border-gray-200">
                                  <th className="p-3 text-left font-semibold text-gray-500 sticky left-0 bg-gray-50 z-10 w-32">Member</th>
                                  {history.map(record => (
                                      <th key={record.id} className="p-2 font-medium text-gray-500 min-w-[60px] text-center border-l border-gray-100">
                                          <div>{new Date(record.date).getDate()}/{new Date(record.date).getMonth() + 1}</div>
                                          <div className="text-[10px] font-normal uppercase">{record.dayType.substr(0, 3)}</div>
                                      </th>
                                  ))}
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                              {members.map(member => (
                                  <tr key={member.id} className="hover:bg-gray-50/50">
                                      <td className="p-3 font-medium text-gray-900 sticky left-0 bg-white border-r border-gray-100 z-10 truncate max-w-[120px]" title={member.fullName}>
                                          {member.fullName}
                                      </td>
                                      {history.map(record => {
                                          const status = record.records.find(r => r.memberId === member.id)?.status || 'Absent';
                                          const colorClass = getGridColor(status);
                                          return (
                                              <td key={`${record.id}_${member.id}`} className="p-2 text-center border-l border-gray-100">
                                                  <div className={`w-6 h-6 rounded mx-auto ${colorClass}`} title={status}></div>
                                              </td>
                                          );
                                      })}
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                      {history.length === 0 && <div className="p-8 text-center text-gray-400">No attendance records found for this period.</div>}
                  </div>
              </Card>
          </div>
      )}

      {activeTab === 'followup' && (
          <div className="space-y-4">
              {followUpList.length === 0 ? (
                  <div className="text-center py-16 bg-white border border-gray-200 rounded-xl">
                      <CheckCircle className="w-12 h-12 text-green-200 mx-auto mb-3" />
                      <h3 className="font-bold text-gray-900">All caught up!</h3>
                      <p className="text-gray-500 text-sm">No members are currently flagged for follow-up (Absent &gt; 28 days).</p>
                  </div>
              ) : (
                  <>
                    <Card className="bg-orange-50 border-orange-200 p-4 flex gap-3">
                        <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-bold text-orange-800">Review Needed</h4>
                            <p className="text-sm text-orange-700">These members have been absent for 4+ consecutive weeks. Confirm their status to remove them from this list.</p>
                        </div>
                    </Card>

                    {followUpList.map(member => (
                        <Card key={member.id} className="p-5 border-l-4 border-l-orange-500">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900">{member.fullName}</h3>
                                    <p className="text-xs text-gray-500">#{member.classNumber} • {member.phone}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs font-bold text-gray-400 uppercase">Last Seen</div>
                                    <div className="text-sm font-semibold text-gray-700">
                                        {member.lastAttended ? new Date(member.lastAttended).toLocaleDateString() : 'Never'}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100">
                                <Button size="sm" variant="outline" className="text-yellow-700 border-yellow-200 bg-yellow-50 hover:bg-yellow-100 text-xs px-2" onClick={() => handleFollowUpAction(member.id, 'Sick')}>
                                    Confirm Sick
                                </Button>
                                <Button size="sm" variant="outline" className="text-blue-700 border-blue-200 bg-blue-50 hover:bg-blue-100 text-xs px-2" onClick={() => handleFollowUpAction(member.id, 'Travelled')}>
                                    Confirm Travel
                                </Button>
                                <Button size="sm" variant="outline" className="text-gray-700 border-gray-200 bg-gray-50 hover:bg-gray-100 text-xs px-2" onClick={() => handleFollowUpAction(member.id, 'Resolved')}>
                                    Still Absent
                                </Button>
                            </div>
                        </Card>
                    ))}
                  </>
              )}
          </div>
      )}

      {activeTab === 'followup' && (
          <div className="space-y-4">
              {followUpList.length === 0 ? (
                  <div className="text-center py-16 bg-white border border-gray-200 rounded-xl">
                      <CheckCircle className="w-12 h-12 text-green-200 mx-auto mb-3" />
                      <h3 className="font-bold text-gray-900">All caught up!</h3>
                      <p className="text-gray-500 text-sm">No members are currently flagged for follow-up (Absent &gt; 28 days).</p>
                  </div>
              ) : (
                  <>
                    <Card className="bg-orange-50 border-orange-200 p-4 flex gap-3">
                        <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-bold text-orange-800">Review Needed</h4>
                            <p className="text-sm text-orange-700">These members have been absent for 4+ consecutive weeks. Confirm their status to remove them from this list.</p>
                        </div>
                    </Card>

                    {followUpList.map(member => (
                        <Card key={member.id} className="p-5 border-l-4 border-l-orange-500">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900">{member.fullName}</h3>
                                    <p className="text-xs text-gray-500">#{member.classNumber} • {member.phone}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs font-bold text-gray-400 uppercase">Last Seen</div>
                                    <div className="text-sm font-semibold text-gray-700">
                                        {member.lastAttended ? new Date(member.lastAttended).toLocaleDateString() : 'Never'}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100">
                                <Button size="sm" variant="outline" className="text-yellow-700 border-yellow-200 bg-yellow-50 hover:bg-yellow-100 text-xs px-2" onClick={() => handleFollowUpAction(member.id, 'Sick')}>
                                    Confirm Sick
                                </Button>
                                <Button size="sm" variant="outline" className="text-blue-700 border-blue-200 bg-blue-50 hover:bg-blue-100 text-xs px-2" onClick={() => handleFollowUpAction(member.id, 'Travelled')}>
                                    Confirm Travel
                                </Button>
                                <Button size="sm" variant="outline" className="text-gray-700 border-gray-200 bg-gray-50 hover:bg-gray-100 text-xs px-2" onClick={() => handleFollowUpAction(member.id, 'Resolved')}>
                                    Still Absent
                                </Button>
                            </div>
                        </Card>
                    ))}
                  </>
              )}
          </div>
      )}

      {activeTab === 'reports' && (
          <div className="space-y-6">
              <Card className="bg-blue-50 border-blue-200 p-4 flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                      <h4 className="font-bold text-blue-800">Flagged Members Report</h4>
                      <p className="text-sm text-blue-700">Members are automatically flagged if not seen in 30+ days (escalates to 90+ days for See to Meet). Review, edit if needed, and send to Rev. Minister & Stewards.</p>
                  </div>
              </Card>

              {flaggedThirty.length === 0 && flaggedNinety.length === 0 ? (
                  <div className="text-center py-16 bg-white border border-gray-200 rounded-xl">
                      <CheckCircle className="w-12 h-12 text-green-200 mx-auto mb-3" />
                      <h3 className="font-bold text-gray-900">No flagged members</h3>
                      <p className="text-gray-500 text-sm">All members have attended within the last 30 days.</p>
                  </div>
              ) : (
                  <>
                    {/* 30-Day Flagged */}
                    {flaggedThirty.length > 0 && (
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                                <h3 className="font-bold text-gray-900">30-Day Absent ({selectedThirty.length}/{flaggedThirty.length})</h3>
                            </div>
                            <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-2 max-h-64 overflow-y-auto">
                                {flaggedThirty.map(member => (
                                    <label key={member.id} className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 cursor-pointer">
                                        <input 
                                            type="checkbox"
                                            checked={selectedThirty.includes(member.id)}
                                            onChange={e => {
                                                if (e.target.checked) {
                                                    setSelectedThirty([...selectedThirty, member.id]);
                                                } else {
                                                    setSelectedThirty(selectedThirty.filter(id => id !== member.id));
                                                }
                                            }}
                                            className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                                        />
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">{member.fullName}</p>
                                            <p className="text-xs text-gray-500">#{member.classNumber} • Last: {member.lastAttended ? new Date(member.lastAttended).toLocaleDateString() : 'Never'}</p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 90-Day / See to Meet */}
                    {flaggedNinety.length > 0 && (
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-red-600" />
                                <h3 className="font-bold text-gray-900">See to Meet (90+ Days) ({selectedNinety.length}/{flaggedNinety.length})</h3>
                            </div>
                            <div className="bg-white rounded-xl border border-red-200 p-4 space-y-2 max-h-64 overflow-y-auto">
                                {flaggedNinety.map(member => (
                                    <label key={member.id} className="flex items-center gap-3 p-2 rounded hover:bg-red-50 cursor-pointer">
                                        <input 
                                            type="checkbox"
                                            checked={selectedNinety.includes(member.id)}
                                            onChange={e => {
                                                if (e.target.checked) {
                                                    setSelectedNinety([...selectedNinety, member.id]);
                                                } else {
                                                    setSelectedNinety(selectedNinety.filter(id => id !== member.id));
                                                }
                                            }}
                                            className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                                        />
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">{member.fullName}</p>
                                            <p className="text-xs text-gray-500">#{member.classNumber} • Last: {member.lastAttended ? new Date(member.lastAttended).toLocaleDateString() : 'Never'}</p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Send Button */}
                    <div className="sticky bottom-6 flex justify-end gap-2">
                        <Button variant="outline" onClick={exportAsCSV} className="gap-2">
                            <Download className="w-4 h-4" /> Export CSV
                        </Button>
                        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200">
                            <input 
                                type="checkbox"
                                checked={smsNotifyEnabled}
                                onChange={e => setSmsNotifyEnabled(e.target.checked)}
                                className="w-4 h-4 rounded cursor-pointer"
                            />
                            <label className="text-sm font-medium text-gray-700 cursor-pointer">SMS to Stewards</label>
                        </div>
                        <Button 
                            isLoading={reportSending}
                            onClick={sendFlaggedReport}
                            disabled={selectedThirty.length === 0 && selectedNinety.length === 0}
                            className="gap-2 shadow-xl"
                        >
                            <Send className="w-4 h-4" /> Send Report ({selectedThirty.length + selectedNinety.length})
                        </Button>
                    </div>
                  </>
              )}
          </div>
      )}

      {activeTab === 'messages' && (
          <div className="space-y-4">
              {messages.length === 0 && (
                  <div className="text-center py-12 text-gray-400 bg-white border border-gray-200 rounded-xl">
                      No messages from members yet.
                  </div>
              )}
              {messages.map(msg => (
                  <Card key={msg.id} className={`p-5 ${!msg.isRead ? 'bg-blue-50 border-blue-200' : 'bg-white'}`}>
                      <div className="flex justify-between items-start mb-2">
                          <div>
                              <h3 className="font-bold text-gray-900">{msg.senderName}</h3>
                              <p className="text-xs text-gray-500">{msg.senderPhone}</p>
                          </div>
                          {!msg.isRead && <Badge color="blue">New</Badge>}
                      </div>
                      <p className="text-gray-800 my-3">{msg.message}</p>
                      <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                           <span className="text-xs text-gray-400">{new Date(msg.date).toLocaleString()}</span>
                           {!msg.isRead ? (
                               <Button size="sm" variant="ghost" onClick={() => handleMarkMessageRead(msg.id)} className="text-blue-600 hover:bg-blue-100">
                                   Mark Read
                               </Button>
                           ) : (
                               <span className="text-xs text-green-600 flex items-center gap-1"><Check className="w-3 h-3"/> Read</span>
                           )}
                      </div>
                  </Card>
              ))}
          </div>
      )}
    </div>
  );
};

export default ClassManager;
