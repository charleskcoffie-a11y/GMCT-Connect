import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Menu, X, Home, Mic2, BookOpen, Calendar, Sun, 
  MessageCircle, Music, User as UserIcon, Settings,
  LayoutDashboard
} from 'lucide-react';
import { UserRole } from '../types';

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, switchRole } = useAuth();

  const closeSidebar = () => setSidebarOpen(false);

  // Helper to check role access
  const hasAccess = (restrictedTo?: UserRole[]) => {
      if (!restrictedTo) return true;
      if (!user) return false;
      return restrictedTo.includes(user.role);
  };

  const NavItem = ({ to, icon: Icon, label, restrictedTo, hiddenFor }: { to: string; icon: any; label: string; restrictedTo?: UserRole[]; hiddenFor?: UserRole[] }) => {
    if (restrictedTo && user && !restrictedTo.includes(user.role)) return null;
    if (hiddenFor && user && hiddenFor.includes(user.role)) return null;
    
    return (
      <NavLink
        to={to}
        onClick={closeSidebar}
        className={({ isActive }) =>
          `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
            isActive 
              ? 'bg-brand-50 text-brand-700 font-semibold' 
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`
        }
      >
        <Icon className="w-5 h-5" />
        <span>{label}</span>
      </NavLink>
    );
  };

  return (
    <div className="h-[100dvh] bg-gray-50 flex flex-col md:flex-row overflow-hidden font-sans">
      {/* Mobile Header */}
      <div className="bg-white/90 backdrop-blur-md border-b py-3 px-4 flex justify-between items-center md:hidden z-30 shrink-0 sticky top-0">
        <span className="font-bold text-lg text-brand-700 tracking-tight">GMCT Connect</span>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-gray-700 hover:bg-gray-100 rounded-full active:bg-gray-200 transition-colors">
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden transition-opacity" 
          onClick={closeSidebar} 
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r transform transition-transform duration-300 cubic-bezier(0.4, 0, 0.2, 1) md:translate-x-0 md:static h-full flex flex-col shadow-2xl md:shadow-none
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b flex flex-col gap-2 shrink-0">
          <h1 className="text-2xl font-bold text-brand-700 tracking-tight">GMCT Connect</h1>
          {user && (
            <div className="text-xs text-brand-700 font-semibold px-2 py-1 bg-brand-50 border border-brand-100 rounded-md self-start uppercase tracking-wider">
              {user.role.replace('_', ' ')} View
            </div>
          )}
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto flex-1">
          <NavItem to="/" icon={Home} label="Home" />
          <NavItem to="/portal" icon={LayoutDashboard} label="My Portal" />
          <div className="h-px bg-gray-200 my-2 mx-4" />
          <NavItem to="/announcements" icon={Mic2} label="Announcements" />
          <NavItem to="/verse" icon={BookOpen} label="Daily Verse" />
          <NavItem to="/events" icon={Calendar} label="Events" />
          <NavItem to="/service" icon={Sun} label="Sunday Service" />
          <NavItem to="/devotion" icon={MessageCircle} label="Devotion" />
          <NavItem to="/sermons" icon={Mic2} label="Sermons" />
          <NavItem to="/hymnal" icon={Music} label="Hymnal" />
          
          <div className="h-px bg-gray-200 my-2 mx-4" />
          
           <NavItem to="/profile" icon={UserIcon} label="Profile" />
           {/* Settings blocked for Minister */}
           <NavItem to="/settings" icon={Settings} label="Settings" hiddenFor={['rev_minister']} />
        </nav>

        {/* Role Switcher for Demo */}
        <div className="p-4 bg-gray-50 border-t shrink-0">
          <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide">DEMO: Switch Role</p>
          <div className="relative">
            <select 
              className="w-full text-sm p-2.5 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none appearance-none font-medium"
              value={user?.role} 
              onChange={(e) => switchRole(e.target.value as UserRole)}
            >
              <option value="member">Member</option>
              <option value="class_leader">Class Leader</option>
              <option value="society_steward">Society Steward</option>
              <option value="rev_minister">Rev Minister</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-full scroll-smooth bg-gray-50/50">
        <div className="max-w-4xl mx-auto pb-24 md:pb-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;