
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { PageHeader, Card, Button } from '../../components/UI';
import { Link } from 'react-router-dom';
import { 
  ClipboardCheck, Users, HeartHandshake, Mail, 
  ShieldCheck, ArrowRight, MessageSquare, Calendar
} from 'lucide-react';

const PortalHome: React.FC = () => {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div>
      <PageHeader title="My Portal" />

      <div className="grid gap-6">
        {/* === REV MINISTER PORTAL === */}
        {user.role === 'rev_minister' && (
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Minister's Dashboard</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Link to="/portal/minister" className="group">
                <Card className="p-6 h-full hover:border-brand-500 transition-colors bg-brand-50 border-brand-100">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-brand-200 text-brand-800 rounded-full">
                      <HeartHandshake className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-brand-900">Pastoral Care</h3>
                      <p className="text-brand-700 text-sm">Prayer Requests & Messages</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-brand-600 font-medium group-hover:underline">
                    <span>Open Inbox</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </Card>
              </Link>
              
              <Link to="/portal/service-planner" className="group">
                <Card className="p-6 h-full hover:border-blue-500 transition-colors bg-blue-50 border-blue-100">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-blue-200 text-blue-800 rounded-full">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-blue-900">Service Planner</h3>
                      <p className="text-blue-700 text-sm">Update Liturgy & Preachers</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-blue-600 font-medium group-hover:underline">
                    <span>Manage Schedule</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </Card>
              </Link>
            </div>
          </section>
        )}

        {/* === CLASS LEADER PORTAL === */}
        {user.role === 'class_leader' && (
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Class Leader Tools</h2>
            <Card className="p-0 overflow-hidden bg-white border-blue-200">
               <div className="p-6 bg-blue-50 border-b border-blue-100">
                  <div className="flex items-center justify-between">
                     <div>
                        <h3 className="text-xl font-bold text-blue-900">My Class: {user.className}</h3>
                        <p className="text-blue-700 text-sm">Manage your members and attendance</p>
                     </div>
                     <Users className="w-8 h-8 text-blue-300" />
                  </div>
               </div>
               <div className="grid divide-y md:divide-y-0 md:divide-x grid-cols-1 md:grid-cols-2">
                  <Link to="/portal/class-manager" className="p-4 hover:bg-gray-50 flex items-center justify-between group">
                     <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                        <span className="font-medium text-gray-700">Member Directory</span>
                     </div>
                     <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-600" />
                  </Link>
                  <Link to="/portal/class-manager" className="p-4 hover:bg-gray-50 flex items-center justify-between group">
                     <div className="flex items-center gap-3">
                        <ClipboardCheck className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                        <span className="font-medium text-gray-700">Mark Attendance</span>
                     </div>
                     <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-600" />
                  </Link>
               </div>
            </Card>
          </section>
        )}

        {/* === SOCIETY STEWARD PORTAL === */}
        {user.role === 'society_steward' && (
          <section className="space-y-4">
             <h2 className="text-lg font-bold text-gray-900">Steward Dashboard</h2>
             <Link to="/portal/steward">
                <Card className="p-6 bg-purple-50 border-purple-100 hover:border-purple-300 transition-colors">
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-purple-200 text-purple-800 rounded-full">
                         <ShieldCheck className="w-6 h-6" />
                      </div>
                      <div>
                         <h3 className="text-xl font-bold text-purple-900">Administration</h3>
                         <p className="text-purple-700 text-sm">Overview of announcements & events</p>
                      </div>
                   </div>
                </Card>
             </Link>
          </section>
        )}

        {/* === MEMBER TOOLS (Available to ALL) === */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Member Services</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link to="/portal/prayer-request" className="group">
               <Card className="p-5 hover:shadow-md transition-all flex items-center gap-4">
                  <div className="bg-orange-100 p-3 rounded-full text-orange-600">
                     <HeartHandshake className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                     <h3 className="font-bold text-gray-900">Prayer Request</h3>
                     <p className="text-xs text-gray-500">Send a confidential request</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-orange-500" />
               </Card>
            </Link>

            <Link to="/portal/message-minister" className="group">
               <Card className="p-5 hover:shadow-md transition-all flex items-center gap-4">
                  <div className="bg-green-100 p-3 rounded-full text-green-600">
                     <Mail className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                     <h3 className="font-bold text-gray-900">Message Minister</h3>
                     <p className="text-xs text-gray-500">Send a direct message</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-green-500" />
               </Card>
            </Link>

            {/* New Message Class Leader Option */}
            {user.role === 'member' && user.classId && (
              <Link to="/portal/message-leader" className="group col-span-2 md:col-span-1">
                 <Card className="p-5 hover:shadow-md transition-all flex items-center gap-4">
                    <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                       <MessageSquare className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                       <h3 className="font-bold text-gray-900">Message Class Leader</h3>
                       <p className="text-xs text-gray-500">Contact leader of {user.className}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500" />
                 </Card>
              </Link>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default PortalHome;
