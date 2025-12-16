import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { PageHeader, Card, Button, LoadingScreen } from '../../components/UI';
import { ClassService } from '../../services/api';
import { SmsService } from '../../services/api';
import { Member } from '../../types';
import { Send, AlertCircle, MessageSquare, Users, Lock } from 'lucide-react';

const SMS: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Message State
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set());

  // Message templates
  const templates = [
    {
      id: 'service-sunday',
      name: 'Sunday Service Reminder',
      subject: 'Sunday Service Today',
      body: 'Good morning! Join us for worship service today at 10:00 AM. All are welcome. God bless you.'
    },
    {
      id: 'service-midweek',
      name: 'Midweek Service',
      subject: 'Midweek Service Tonight',
      body: 'Good evening! We invite you to our midweek service tonight at 6:00 PM. Come and be refreshed in the Word.'
    },
    {
      id: 'bereavement',
      name: 'Bereavement Notice',
      subject: 'Bereavement Announcement',
      body: 'Dear church family, it is with sadness that we announce the passing of [Name]. Funeral details to follow. Please keep the family in your prayers.'
    },
    {
      id: 'special-event',
      name: 'Special Event',
      subject: 'Special Program Invitation',
      body: 'You are cordially invited to our special program on [Date] at [Time]. Join us for a blessed time of fellowship and worship.'
    },
    {
      id: 'church-meeting',
      name: 'Church Meeting',
      subject: 'Church Meeting Reminder',
      body: 'Reminder: Church meeting scheduled for [Date] at [Time]. Your attendance is important. See you there!'
    },
    {
      id: 'prayer-request',
      name: 'Prayer Call',
      subject: 'Prayer Request',
      body: 'Dear members, please join us in prayer for [specific need]. Let us stand together in faith and intercession.'
    },
    {
      id: 'fundraiser',
      name: 'Fundraising Event',
      subject: 'Fundraising Event',
      body: 'Support our church fundraiser on [Date]. Your participation and generosity are greatly appreciated. Thank you!'
    },
    {
      id: 'communion',
      name: 'Communion Service',
      subject: 'Communion Service',
      body: 'Holy Communion will be celebrated this Sunday at 10:00 AM. Prepare your hearts to partake in this sacred ordinance.'
    },
    {
      id: 'youth-event',
      name: 'Youth Event',
      subject: 'Youth Program',
      body: 'Calling all youth! Join us for an exciting program on [Date] at [Time]. Bring a friend and be blessed!'
    },
    {
      id: 'custom',
      name: 'Start from Scratch',
      subject: '',
      body: ''
    }
  ];

  // Access Control
  useEffect(() => {
    const allowedRoles = ['admin', 'rev_minister', 'society_steward'];
    if (!user || !allowedRoles.includes(user.role)) {
      navigate('/dashboard');
      return;
    }

    loadMembers();
  }, [user, navigate]);

  const loadMembers = async () => {
    // Load all members from all classes
    // For now, mock the data
    const mockMembers: Member[] = [
      { id: '1', fullName: 'John Smith', classId: 'c1', classNumber: '001', phone: '+14165551234', status: 'Active' },
      { id: '2', fullName: 'Jane Doe', classId: 'c2', classNumber: '005', phone: '+14165555678', status: 'Active' },
      { id: '3', fullName: 'James Brown', classId: 'c1', classNumber: '002', phone: '+14165559012', status: 'Active' },
      { id: '4', fullName: 'Mary Johnson', classId: 'c3', classNumber: '010', phone: '+14165553456', status: 'Active' },
      { id: '5', fullName: 'Robert Williams', classId: 'c2', classNumber: '007', phone: '+14165557890', status: 'Active' }
    ];
    setMembers(mockMembers);
    // Select all by default
    const allIds = new Set(mockMembers.filter(m => m.phone).map(m => m.id));
    setSelectedMembers(allIds);
    setLoading(false);
  };

  const handleSend = async () => {
    if (!subject.trim() || !body.trim()) {
      alert('Please fill in both subject and message body.');
      return;
    }

    if (selectedMembers.size === 0) {
      alert('Please select at least one member to send SMS.');
      return;
    }

    const selectedWithPhone = members.filter(m => m.phone && selectedMembers.has(m.id));
    if (selectedWithPhone.length === 0) {
      alert('No selected members with phone numbers found.');
      return;
    }

    setSending(true);
    try {
      const fullMessage = `${subject}\n\n${body}`;
      const phones = selectedWithPhone.map(m => m.phone!);
      await SmsService.sendBulkSms(phones, fullMessage, user?.name || 'Admin');
      
      alert(`SMS sent to ${phones.length} members.\n\nSubject: ${subject}`);
      setSubject('');
      setBody('');
    } finally {
      setSending(false);
    }
  };

  const toggleMember = (memberId: string) => {
    const newSelected = new Set(selectedMembers);
    if (newSelected.has(memberId)) {
      newSelected.delete(memberId);
    } else {
      newSelected.add(memberId);
    }
    setSelectedMembers(newSelected);
  };

  const selectAll = () => {
    const allIds = new Set(members.filter(m => m.phone).map(m => m.id));
    setSelectedMembers(allIds);
  };

  const deselectAll = () => {
    setSelectedMembers(new Set());
  };

  if (loading) return <LoadingScreen />;

  // Role-based access control
  const allowedRoles = ['admin', 'rev_minister', 'society_steward'];
  if (!user || !allowedRoles.includes(user.role)) {
    return (
      <div className="max-w-md mx-auto mt-10">
        <Card className="p-8 text-center border-t-4 border-t-red-600">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-500 text-sm">Only Admin, Rev. Minister, and Society Stewards can send SMS.</p>
        </Card>
      </div>
    );
  }

  const membersWithPhone = members.filter(m => m.phone);

  return (
    <div>
      <PageHeader title="Bulk SMS Messaging" />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-blue-50 border-blue-200 p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-blue-800">SMS Broadcasting</h4>
              <p className="text-sm text-blue-700">Send messages to all members with phone numbers. Useful for announcements, breavement notices, and special events.</p>
            </div>
          </Card>

          <Card className="p-6 space-y-5">
            {/* Template Selector */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Message Template
              </label>
              <select
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => {
                  const template = templates.find(t => t.id === e.target.value);
                  if (template) {
                    setSubject(template.subject);
                    setBody(template.body);
                  }
                }}
                defaultValue=""
              >
                <option value="" disabled>Choose a template or start from scratch...</option>
                {templates.map(template => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1.5">
                Select a pre-made template and edit as needed, or choose "Start from Scratch"
              </p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Subject Line</label>
              <input
                type="text"
                placeholder="e.g., Bereavement Notice - Rev. Samuel Boateng"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                maxLength={50}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-brand-500 outline-none bg-white focus:bg-blue-50 transition-colors"
              />
              <p className="text-xs text-gray-400 mt-1">{subject.length}/50 characters</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Message Body</label>
              <textarea
                placeholder="Write your message here. Include important details and contact information if needed..."
                value={body}
                onChange={e => setBody(e.target.value)}
                maxLength={480}
                rows={8}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-brand-500 outline-none bg-white focus:bg-blue-50 transition-colors resize-none"
              />
              <p className="text-xs text-gray-400 mt-1">{body.length}/480 characters</p>
              <p className="text-xs text-gray-500 mt-2">💡 Tip: Keep messages clear and concise. SMS has length limits on most carriers.</p>
            </div>

            {/* Preview */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Preview</label>
              <Card className="p-4 bg-gray-50 border border-gray-200">
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase mb-2">Message Preview</p>
                  <p className="text-sm text-gray-900 font-semibold mb-2">{subject || '(Subject)'}</p>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{body || '(Message body)'}</p>
                  <p className="text-xs text-gray-400 mt-3">From: GMCT Connect</p>
                </div>
              </Card>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <Button
                onClick={handleSend}
                isLoading={sending}
                className="gap-2 shadow-lg"
                disabled={!subject.trim() || !body.trim() || selectedMembers.size === 0}
              >
                <Send className="w-4 h-4" /> Send to {selectedMembers.size} Selected
              </Button>
            </div>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-4">
          <Card className="p-5 border-t-4 border-t-brand-600 bg-white">
            <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-brand-600" /> Recipients
            </h3>
            
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-xs text-blue-600 font-bold uppercase mb-1">Selected</p>
                <p className="text-2xl font-bold text-blue-700">{selectedMembers.size}</p>
                <p className="text-xs text-blue-600 mt-1">Will receive SMS</p>
              </div>

              <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                <p className="text-xs text-green-600 font-bold uppercase mb-1">Has Phone</p>
                <p className="text-2xl font-bold text-green-700">{membersWithPhone.length}</p>
                <p className="text-xs text-green-600 mt-1">Available to select</p>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600 font-bold uppercase mb-1">Total Members</p>
                <p className="text-2xl font-bold text-gray-700">{members.length}</p>
                <p className="text-xs text-gray-600 mt-1">In the system</p>
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-blue-50 border-blue-200">
            <h4 className="font-bold text-blue-900 mb-3">📋 Best Practices</h4>
            <ul className="text-xs text-blue-800 space-y-2 leading-relaxed">
              <li>✓ Keep messages under 160 characters for single SMS</li>
              <li>✓ Include action items or contact details</li>
              <li>✓ Use clear, concise language</li>
              <li>✓ Send important notices during business hours</li>
              <li>✓ Avoid sensitive personal information</li>
            </ul>
          </Card>

          <Card className="p-5 bg-yellow-50 border-yellow-200">
            <h4 className="font-bold text-yellow-900 mb-3">⚠️ Important</h4>
            <p className="text-xs text-yellow-800 leading-relaxed">
              All sent messages are logged and auditable. Recipients' phone numbers are treated as confidential.
            </p>
          </Card>
        </div>
      </div>

      {/* Member List */}
      <Card className="mt-8 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-gray-600" /> Recipients List
          </h3>
          
          <div className="flex gap-2">
            <Button 
              onClick={selectAll}
              variant="outline"
              className="text-sm py-1.5 px-3"
            >
              Select All
            </Button>
            <Button 
              onClick={deselectAll}
              variant="outline"
              className="text-sm py-1.5 px-3"
            >
              Deselect All
            </Button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="p-3 text-left w-12">
                  <input 
                    type="checkbox"
                    checked={selectedMembers.size === membersWithPhone.length && membersWithPhone.length > 0}
                    onChange={(e) => e.target.checked ? selectAll() : deselectAll()}
                    className="w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                  />
                </th>
                <th className="p-3 text-left font-semibold text-gray-600">Name</th>
                <th className="p-3 text-left font-semibold text-gray-600">Class</th>
                <th className="p-3 text-left font-semibold text-gray-600">Phone</th>
                <th className="p-3 text-left font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {members.map(member => (
                <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-3">
                    {member.phone && (
                      <input 
                        type="checkbox"
                        checked={selectedMembers.has(member.id)}
                        onChange={() => toggleMember(member.id)}
                        className="w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                      />
                    )}
                  </td>
                  <td className="p-3 text-gray-900 font-medium">{member.fullName}</td>
                  <td className="p-3 text-gray-600">{member.classId}</td>
                  <td className="p-3 text-gray-600 font-mono text-xs">
                    {member.phone ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded border border-green-100">
                        ✓ {member.phone}
                      </span>
                    ) : (
                      <span className="text-gray-400">No phone</span>
                    )}
                  </td>
                  <td className="p-3">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${member.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {member.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default SMS;
