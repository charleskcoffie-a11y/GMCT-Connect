import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { PageHeader, Card, Button, Badge } from '../components/UI';
import { Calendar, MessageSquare, AlertTriangle, CheckCircle, Baby, Droplets } from 'lucide-react';

interface NamingBaptismRequest {
  id: string;
  memberName: string;
  childName: string;
  services: string[]; // ['Naming', 'Baptism', or both]
  requestedDate: string;
  shareDate: boolean;
  message: string;
  status: 'pending' | 'approved' | 'scheduled';
  submittedAt: string;
}

const NamingBaptismRequests: React.FC = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<NamingBaptismRequest[]>([
    {
      id: '1',
      memberName: 'John Smith',
      childName: 'Emma Smith',
      services: ['Naming'],
      requestedDate: '2025-01-19',
      shareDate: false,
      message: 'Blessing ceremony for newborn',
      status: 'scheduled',
      submittedAt: '2024-12-10'
    },
    {
      id: '2',
      memberName: 'Mary Johnson',
      childName: 'David Johnson',
      services: ['Baptism'],
      requestedDate: '2025-02-16',
      shareDate: true,
      message: 'Water baptism for 6-month-old',
      status: 'approved',
      submittedAt: '2024-12-08'
    }
  ]);

  const [formData, setFormData] = useState({
    childName: '',
    services: [] as string[],
    requestedDate: '',
    shareDate: false,
    message: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [dateError, setDateError] = useState('');

  // Get all third Sundays of the current and next 3 months
  const thirdSundays = useMemo(() => {
    const sundays: string[] = [];
    const today = new Date();
    
    for (let m = 0; m < 4; m++) {
      const month = new Date(today.getFullYear(), today.getMonth() + m, 1);
      let sundayCount = 0;
      
      for (let day = 1; day <= 31; day++) {
        const date = new Date(month.getFullYear(), month.getMonth(), day);
        if (date.getMonth() !== month.getMonth()) break;
        
        if (date.getDay() === 0) {
          sundayCount++;
          if (sundayCount === 3) {
            sundays.push(date.toISOString().split('T')[0]);
            break;
          }
        }
      }
    }
    
    return sundays;
  }, []);

  const isThirdSunday = (dateStr: string) => thirdSundays.includes(dateStr);

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setFormData(prev => ({ ...prev, requestedDate: date }));
    
    if (date && !isThirdSunday(date)) {
      setDateError('⚠️ Only 3rd Sundays of the month are available for Naming & Baptism services.');
    } else {
      setDateError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.childName || !formData.services.length || !formData.requestedDate) {
      alert('Please fill in all required fields');
      return;
    }

    if (!isThirdSunday(formData.requestedDate)) {
      alert('Please select a valid 3rd Sunday of the month.');
      return;
    }

    setSubmitting(true);

    // Simulate API call to send to minister
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newRequest: NamingBaptismRequest = {
      id: Date.now().toString(),
      memberName: user?.name || 'Member',
      childName: formData.childName,
      services: formData.services,
      requestedDate: formData.requestedDate,
      shareDate: formData.shareDate,
      message: formData.message,
      status: 'pending',
      submittedAt: new Date().toISOString().split('T')[0]
    };

    setRequests([newRequest, ...requests]);
    setFormData({
      childName: '',
      services: [],
      requestedDate: '',
      shareDate: false,
      message: ''
    });
    setDateError('');
    setSubmitting(false);

    alert('✅ Your request has been sent to the Minister. You will receive confirmation soon!');
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'scheduled': return 'green';
      case 'approved': return 'blue';
      default: return 'gray';
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const availableSundaysList = thirdSundays.slice(0, 4).map(d => formatDate(d)).join(', ');

  return (
    <div className="space-y-8 pb-10">
      <PageHeader title="Naming & Baptism Requests" />

      {/* Available Dates Info */}
      <Card className="p-4 sm:p-6 bg-blue-50 border-blue-200">
        <div className="flex gap-3">
          <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-blue-900 mb-1">Available Dates</h3>
            <p className="text-sm text-blue-800">
              Naming & Baptism services are conducted on the <strong>3rd Sunday of each month</strong>. 
              <br className="hidden sm:block" />
              Upcoming dates: <strong className="text-blue-900">{availableSundaysList}</strong>
            </p>
          </div>
        </div>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Request Form */}
        <div className="lg:col-span-2">
          <Card className="p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Submit a Request</h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Child Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Child's Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter child's name"
                  value={formData.childName}
                  onChange={(e) => setFormData(prev => ({ ...prev, childName: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none text-sm"
                />
              </div>

              {/* Service Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Select Service(s) *
                </label>
                <div className="space-y-2 sm:space-y-0 sm:flex gap-4">
                  <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer flex-1">
                    <input
                      type="checkbox"
                      checked={formData.services.includes('Naming')}
                      onChange={() => handleServiceToggle('Naming')}
                      className="w-5 h-5 rounded cursor-pointer"
                    />
                    <div className="flex items-center gap-2">
                      <Baby className="w-4 h-4 text-brand-600" />
                      <span className="font-medium text-sm">Naming Ceremony</span>
                    </div>
                  </label>
                  
                  <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer flex-1">
                    <input
                      type="checkbox"
                      checked={formData.services.includes('Baptism')}
                      onChange={() => handleServiceToggle('Baptism')}
                      className="w-5 h-5 rounded cursor-pointer"
                    />
                    <div className="flex items-center gap-2">
                      <Droplets className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-sm">Baptism</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Date Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Preferred Date (3rd Sunday) *
                </label>
                <input
                  type="date"
                  required
                  value={formData.requestedDate}
                  onChange={handleDateChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none text-sm"
                />
                {dateError && (
                  <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm text-yellow-800">{dateError}</p>
                  </div>
                )}
              </div>

              {/* Share Date */}
              <div>
                <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.shareDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, shareDate: e.target.checked }))}
                    className="w-5 h-5 rounded cursor-pointer"
                  />
                  <span className="font-medium text-sm text-gray-700">
                    I'm willing to share my scheduled date with another family
                  </span>
                </label>
                {formData.shareDate && (
                  <p className="mt-2 text-xs text-gray-500 italic">
                    ✓ Other members will see your date and can schedule on the same day
                  </p>
                )}
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Additional Message (Optional)
                </label>
                <textarea
                  placeholder="Any special requests or additional information for the Minister..."
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none text-sm h-28 resize-none"
                />
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                disabled={submitting}
                isLoading={submitting}
                className="w-full gap-2 text-sm sm:text-base"
              >
                <MessageSquare className="w-4 h-4" /> Send Request to Minister
              </Button>
            </form>
          </Card>
        </div>

        {/* Statistics */}
        <div className="lg:col-span-1">
          <Card className="p-4 bg-gradient-to-br from-brand-50 to-blue-50 border-brand-200">
            <h3 className="font-bold text-gray-900 mb-4">Request Summary</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-600 uppercase font-semibold">Total Requests</p>
                <p className="text-2xl font-bold text-brand-600">{requests.length}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase font-semibold">Scheduled</p>
                <p className="text-2xl font-bold text-green-600">
                  {requests.filter(r => r.status === 'scheduled').length}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase font-semibold">Pending</p>
                <p className="text-2xl font-bold text-gray-600">
                  {requests.filter(r => r.status === 'pending').length}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Requests Log */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Requests Log</h2>
        
        {requests.length === 0 ? (
          <Card className="p-8 text-center">
            <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No requests submitted yet</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {requests.map(request => (
              <Card key={request.id} className="p-4 sm:p-5 border-l-4 border-l-brand-600">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm sm:text-base">{request.childName}</h3>
                    <p className="text-xs sm:text-sm text-gray-600">By {request.memberName}</p>
                  </div>
                  <Badge color={getStatusColor(request.status) as any}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </Badge>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 mb-3 text-xs sm:text-sm">
                  <div>
                    <span className="text-gray-600">📋 Services:</span>
                    <p className="font-semibold text-gray-900">
                      {request.services.join(' + ')}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">📅 Requested Date:</span>
                    <p className="font-semibold text-gray-900">
                      {formatDate(request.requestedDate)}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">📝 Submitted:</span>
                    <p className="font-semibold text-gray-900">
                      {new Date(request.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">👥 Sharing Date:</span>
                    <p className="font-semibold text-gray-900">
                      {request.shareDate ? '✅ Yes' : '❌ No'}
                    </p>
                  </div>
                </div>

                {request.message && (
                  <div className="p-3 bg-gray-50 rounded border border-gray-200 text-xs sm:text-sm">
                    <p className="text-gray-700 italic">"{request.message}"</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NamingBaptismRequests;
