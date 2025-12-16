
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { PageHeader, Card, Button, Badge } from '../../components/UI';
import { Link } from 'react-router-dom';
import { 
  ClipboardCheck, Users, HeartHandshake, Mail, 
  ShieldCheck, ArrowRight, MessageSquare, Calendar,
  User, Star, BookOpen, Clock, MessageCircle
} from 'lucide-react';

const PortalHome: React.FC = () => {
  const { user } = useAuth();
  if (!user) return null;

  const isMember = user.role === 'member';

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Welcome / Identity Section */}
      <section className="relative">
          <Card className="p-8 bg-gradient-to-br from-brand-800 via-brand-700 to-blue-900 text-white border-none shadow-2xl overflow-hidden relative">
              {/* Background Decorations */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-500/20 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none"></div>

              <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
                 <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-3xl font-bold shadow-inner">
                     {user.name.charAt(0)}
                 </div>
                 <div className="flex-1">
                     <p className="text-brand-200 font-medium mb-1 uppercase tracking-wider text-xs">Welcome back,</p>
                     <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">{user.name}</h1>
                     <div className="flex flex-wrap items-center gap-3">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-sm font-medium backdrop-blur-md">
                            <User className="w-3.5 h-3.5" />
                            {user.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                        {user.className && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/20 text-blue-100 text-sm font-medium backdrop-blur-md">
                                <Users className="w-3.5 h-3.5" />
                                {user.className}
                            </span>
                        )}
                     </div>
                 </div>
                 
                 {/* Quick Stats or Status (Mocked) */}
                 {isMember && (
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 min-w-[140px]">
                        <p className="text-xs text-brand-200 uppercase font-bold mb-1">Status</p>
                        <div className="flex items-center gap-2 text-green-300 font-bold">
                            <div className="w-2 h-2 bg-green-400 rounded-full shadow-[0_0_10px_rgba(74,222,128,0.5)]"></div>
                            Active
                        </div>
                    </div>
                 )}
              </div>
          </Card>
      </section>

      {/* Role Specific Dashboards */}
      <div className="grid gap-6">
        
        {/* === REV MINISTER PORTAL === */}
        {user.role === 'rev_minister' && (
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-brand-500" /> Ministry Tools
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Link to="/portal/minister" className="group">
                <Card className="p-6 h-full hover:border-brand-500 transition-all hover:shadow-lg bg-white dark:bg-slate-800 border-l-4 border-l-brand-500">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-xl">
                      <HeartHandshake className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Pastoral Care</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Prayer Requests & Messages</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-brand-600 font-medium group-hover:translate-x-1 transition-transform">
                    <span className="text-sm">View Inbox</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </Card>
              </Link>
              
              <Link to="/portal/service-planner" className="group">
                <Card className="p-6 h-full hover:border-blue-500 transition-all hover:shadow-lg bg-white dark:bg-slate-800 border-l-4 border-l-blue-500">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Service Planner</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Liturgy & Scheduling</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-blue-600 font-medium group-hover:translate-x-1 transition-transform">
                    <span className="text-sm">Manage Schedule</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </Card>
              </Link>

              <Link to="/portal/sms" className="group">
                <Card className="p-6 h-full hover:border-purple-500 transition-all hover:shadow-lg bg-white dark:bg-slate-800 border-l-4 border-l-purple-500">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl">
                      <MessageCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Bulk SMS</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Announcements & Alerts</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-purple-600 font-medium group-hover:translate-x-1 transition-transform">
                    <span className="text-sm">Send Message</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </Card>
              </Link>
            </div>
          </section>
        )}

        {/* === SOCIETY STEWARD PORTAL === */}
        {user.role === 'society_steward' && (
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-600" /> Steward Tools
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Link to="/portal/steward" className="group">
                <Card className="p-6 h-full hover:border-amber-600 transition-all hover:shadow-lg bg-white dark:bg-slate-800 border-l-4 border-l-amber-600">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Dashboard</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Announcements & Updates</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-amber-600 font-medium group-hover:translate-x-1 transition-transform">
                    <span className="text-sm">View Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </Card>
              </Link>

              <Link to="/portal/sms" className="group">
                <Card className="p-6 h-full hover:border-purple-500 transition-all hover:shadow-lg bg-white dark:bg-slate-800 border-l-4 border-l-purple-500">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl">
                      <MessageCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Bulk SMS</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Announcements & Alerts</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-purple-600 font-medium group-hover:translate-x-1 transition-transform">
                    <span className="text-sm">Send Message</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </Card>
              </Link>
            </div>
          </section>
        )}

        {/* === ADMIN PORTAL === */}
        {user.role === 'admin' && (
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-red-600" /> Admin Tools
            </h2>
            <Link to="/portal/sms" className="group">
              <Card className="p-6 h-full hover:border-purple-500 transition-all hover:shadow-lg bg-white dark:bg-slate-800 border-l-4 border-l-purple-500">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Bulk SMS</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Send announcements to all members</p>
                  </div>
                </div>
                <div className="flex justify-between items-center text-purple-600 font-medium group-hover:translate-x-1 transition-transform">
                  <span className="text-sm">Send Message</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Card>
            </Link>
          </section>
        )}

        {/* === CLASS LEADER PORTAL === */}
        {user.role === 'class_leader' && (
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-brand-500" /> Leadership Tools
            </h2>
            <Card className="p-0 overflow-hidden bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 shadow-md">
               <div className="p-6 bg-gradient-to-r from-blue-50 to-white dark:from-slate-800 dark:to-slate-700 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                     <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Class Management</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Manage {user.className} members and attendance</p>
                     </div>
                     <div className="bg-white dark:bg-slate-600 p-2 rounded-lg shadow-sm">
                        <Users className="w-8 h-8 text-blue-500 dark:text-blue-400" />
                     </div>
                  </div>
               </div>
               <div className="grid divide-y md:divide-y-0 md:divide-x dark:divide-gray-700 grid-cols-1 md:grid-cols-2">
                  <Link to="/portal/class-manager" className="p-5 hover:bg-gray-50 dark:hover:bg-slate-700/50 flex items-center justify-between group transition-colors">
                     <div className="flex items-center gap-4">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                            <Users className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="font-bold text-gray-900 dark:text-gray-100 block">Member Directory</span>
                            <span className="text-xs text-gray-500">View roster & contact info</span>
                        </div>
                     </div>
                     <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-brand-600 transition-colors" />
                  </Link>
                  <Link to="/portal/class-manager" className="p-5 hover:bg-gray-50 dark:hover:bg-slate-700/50 flex items-center justify-between group transition-colors">
                     <div className="flex items-center gap-4">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-lg">
                            <ClipboardCheck className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="font-bold text-gray-900 dark:text-gray-100 block">Attendance</span>
                            <span className="text-xs text-gray-500">Mark weekly register</span>
                        </div>
                     </div>
                     <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-brand-600 transition-colors" />
                  </Link>
               </div>
            </Card>
          </section>
        )}

        {/* === SOCIETY STEWARD PORTAL === */}
        {user.role === 'society_steward' && (
          <section className="space-y-4">
             <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-purple-500" /> Steward Administration
             </h2>
             <Link to="/portal/steward">
                <Card className="p-6 bg-purple-50 dark:bg-purple-900/10 border-purple-100 dark:border-purple-800 hover:border-purple-300 transition-all hover:shadow-md">
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200 rounded-xl">
                         <ShieldCheck className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                         <h3 className="text-xl font-bold text-purple-900 dark:text-purple-100">Steward Dashboard</h3>
                         <p className="text-purple-700 dark:text-purple-300 text-sm">Manage announcements, events, and church communications</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-purple-400" />
                   </div>
                </Card>
             </Link>
          </section>
        )}

        {/* === MEMBER TOOLS (Available to ALL) === */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
             <Star className="w-5 h-5 text-amber-500" /> Member Services
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link to="/portal/prayer-request" className="group">
               <Card className="p-5 hover:shadow-lg transition-all flex items-center gap-4 border-l-4 border-l-orange-400 dark:bg-slate-800">
                  <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-full text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform">
                     <HeartHandshake className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                     <h3 className="font-bold text-gray-900 dark:text-white text-lg">Prayer Request</h3>
                     <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Submit a confidential prayer request to the Minister</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-orange-500 transition-colors" />
               </Card>
            </Link>

            <Link to="/portal/message-minister" className="group">
               <Card className="p-5 hover:shadow-lg transition-all flex items-center gap-4 border-l-4 border-l-green-400 dark:bg-slate-800">
                  <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
                     <Mail className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                     <h3 className="font-bold text-gray-900 dark:text-white text-lg">Message Minister</h3>
                     <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Send a direct message or inquiry to the Minister</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-green-500 transition-colors" />
               </Card>
            </Link>

            {/* Message Class Leader Option */}
            {user.role === 'member' && user.classId && (
              <Link to="/portal/message-leader" className="group col-span-2 md:col-span-1">
                 <Card className="p-5 hover:shadow-lg transition-all flex items-center gap-4 border-l-4 border-l-blue-400 dark:bg-slate-800">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                       <MessageSquare className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                       <h3 className="font-bold text-gray-900 dark:text-white text-lg">Contact Class Leader</h3>
                       <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Send updates about absence, sickness or travel</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors" />
                 </Card>
              </Link>
            )}

             {/* Resources Link */}
             <Link to="/hymnal" className="group col-span-2 md:col-span-1">
                 <Card className="p-5 hover:shadow-lg transition-all flex items-center gap-4 border-l-4 border-l-purple-400 dark:bg-slate-800">
                    <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                       <BookOpen className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                       <h3 className="font-bold text-gray-900 dark:text-white text-lg">Hymnal & Liturgy</h3>
                       <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Access the MHB, CAN, and Order of Service</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-purple-500 transition-colors" />
                 </Card>
              </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PortalHome;
