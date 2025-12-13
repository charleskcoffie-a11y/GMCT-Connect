import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Home, Mic2, BookOpen, Calendar, Sun, 
  MessageCircle, Music, User as UserIcon, Settings,
  LayoutDashboard, Menu, X
} from 'lucide-react';
import { UserRole } from '../types';

const Layout: React.FC = () => {
  const { user, switchRole } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  // --- Configuration ---
  const NAV_ITEMS = [
    { to: "/dashboard", label: "Home", icon: Home, showInBottom: true },
    { to: "/service", label: "Service", icon: Sun, showInBottom: true },
    { to: "/hymnal", label: "Hymnal", icon: Music, showInBottom: true },
    { to: "/events", label: "Events", icon: Calendar, showInBottom: true },
    // Secondary Items (Menu)
    { to: "/portal", label: "My Portal", icon: LayoutDashboard, showInBottom: false },
    { to: "/announcements", label: "Announcements", icon: Mic2, showInBottom: false },
    { to: "/devotion", label: "Devotion", icon: MessageCircle, showInBottom: false },
    { to: "/verse", label: "Daily Verse", icon: BookOpen, showInBottom: false },
    { to: "/sermons", label: "Sermons", icon: Mic2, showInBottom: false },
    { to: "/liturgical", label: "Calendar", icon: Calendar, showInBottom: false },
    { to: "/profile", label: "Profile", icon: UserIcon, showInBottom: false },
    { to: "/settings", label: "Settings", icon: Settings, showInBottom: false, hiddenFor: ['member'] as UserRole[] },
  ];

  const DesktopSidebar = () => (
    <aside className="hidden md:flex fixed inset-y-0 left-0 z-50 w-72 bg-app-card dark:bg-app-darkCard border-r border-app-border dark:border-app-darkBorder flex-col">
      <div className="p-6 border-b border-app-border dark:border-app-darkBorder flex items-center gap-3 shrink-0">
        <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-gray-100 dark:border-gray-700 p-1">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" onError={(e) => e.currentTarget.src='https://ui-avatars.com/api/?name=GMCT&background=1F4FD8&color=fff'} />
        </div>
        <div>
            <h1 className="text-xl font-bold text-brand-900 dark:text-white tracking-tight leading-none">GMCT Connect</h1>
            {user && (
            <div className="text-[10px] font-bold text-app-subtext dark:text-gray-500 uppercase tracking-wider mt-1">
                {user.role.replace('_', ' ')}
            </div>
            )}
        </div>
      </div>

      <nav className="p-4 space-y-1 overflow-y-auto flex-1">
        {NAV_ITEMS.map((item) => {
           if (item.hiddenFor && user && item.hiddenFor.includes(user.role)) return null;
           return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 mb-1 ${
                  isActive 
                    ? 'bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-300 font-semibold' 
                    : 'text-app-subtext hover:bg-brand-50/50 dark:text-gray-400 dark:hover:bg-gray-800'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
           )
        })}
      </nav>

      {/* Role Switcher */}
      <div className="p-4 border-t border-app-border dark:border-app-darkBorder shrink-0 bg-gray-50/50 dark:bg-transparent">
        <p className="text-xs text-app-subtext mb-2 font-medium uppercase tracking-wide">Simulate Role</p>
        <div className="relative">
          <select 
            className="w-full text-sm p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-brand-500 outline-none appearance-none"
            value={user?.role} 
            onChange={(e) => switchRole(e.target.value as any)}
          >
            <option value="member">Member</option>
            <option value="class_leader">Class Leader</option>
            <option value="society_steward">Society Steward</option>
            <option value="rev_minister">Rev Minister</option>
          </select>
        </div>
      </div>
    </aside>
  );

  const MobileBottomNav = () => (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-app-border dark:border-app-darkBorder pb-[env(safe-area-inset-bottom)] z-50 flex justify-between items-center px-2 h-[4.5rem]">
      {NAV_ITEMS.filter(i => i.showInBottom).map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-full h-full space-y-1 ${
              isActive ? 'text-brand-600 dark:text-brand-400' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <item.icon className={`w-6 h-6 ${isActive ? 'fill-brand-100 dark:fill-brand-900/30' : ''} transition-all`} />
              <span className="text-[10px] font-medium tracking-tight">{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
      <button 
        onClick={toggleMobileMenu}
        className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${mobileMenuOpen ? 'text-brand-600 dark:text-brand-400' : 'text-gray-400 dark:text-gray-500'}`}
      >
        <Menu className="w-6 h-6" />
        <span className="text-[10px] font-medium tracking-tight">Menu</span>
      </button>
    </div>
  );

  const MobileMenuOverlay = () => {
    if (!mobileMenuOpen) return null;
    return (
      <div className="md:hidden fixed inset-0 z-[60] bg-app-bg dark:bg-app-darkBg animate-in slide-in-from-bottom-10 fade-in duration-200 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-app-border dark:border-app-darkBorder bg-white dark:bg-slate-900">
           <span className="text-xl font-bold text-brand-900 dark:text-white">Menu</span>
           <button onClick={toggleMobileMenu} className="p-2 bg-gray-100 dark:bg-slate-800 rounded-full">
             <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
           </button>
        </div>
        
        {/* User Card */}
        <div className="p-6 overflow-y-auto">
           <div className="flex items-center gap-4 p-4 bg-brand-600 rounded-2xl text-white shadow-lg mb-6">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg">
                  {user?.name.charAt(0)}
              </div>
              <div>
                  <h3 className="font-bold text-lg leading-tight">{user?.name}</h3>
                  <p className="text-brand-100 text-xs uppercase font-semibold tracking-wide">{user?.role.replace('_', ' ')}</p>
              </div>
           </div>

           {/* Menu Grid */}
           <div className="grid grid-cols-2 gap-3 mb-6">
             {NAV_ITEMS.filter(i => !i.showInBottom).map(item => {
               if (item.hiddenFor && user && item.hiddenFor.includes(user.role)) return null;
               return (
                <NavLink 
                  key={item.to} 
                  to={item.to}
                  onClick={toggleMobileMenu}
                  className="flex flex-col items-center justify-center p-4 bg-white dark:bg-slate-900 rounded-xl border border-app-border dark:border-app-darkBorder shadow-sm active:scale-95 transition-all"
                >
                   <div className="p-3 bg-brand-50 dark:bg-slate-800 rounded-full mb-2 text-brand-700 dark:text-brand-300">
                      <item.icon className="w-6 h-6" />
                   </div>
                   <span className="font-medium text-sm text-brand-900 dark:text-gray-200">{item.label}</span>
                </NavLink>
               );
             })}
           </div>

           {/* Role Switcher (Mobile) */}
           <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-app-border dark:border-app-darkBorder mb-20">
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Simulate Role</label>
              <select 
                className="w-full text-sm p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-200 outline-none"
                value={user?.role} 
                onChange={(e) => switchRole(e.target.value as any)}
              >
                <option value="member">Member</option>
                <option value="class_leader">Class Leader</option>
                <option value="society_steward">Society Steward</option>
                <option value="rev_minister">Rev Minister</option>
              </select>
           </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-[100dvh] flex bg-app-bg dark:bg-app-darkBg font-sans">
      <DesktopSidebar />
      
      {/* Mobile Top Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-app-border dark:border-app-darkBorder flex items-center px-4 justify-between z-40">
         <div className="flex items-center gap-3">
            <div className="w-9 h-9 p-1 bg-brand-50 dark:bg-slate-800 rounded-full border border-brand-100 dark:border-brand-700">
                <img src="/logo.png" alt="GMCT" className="w-full h-full object-contain" onError={(e) => e.currentTarget.src='https://ui-avatars.com/api/?name=GMCT&background=1F4FD8&color=fff'} />
            </div>
            <span className="font-bold text-lg text-brand-900 dark:text-white tracking-tight">GMCT Connect</span>
         </div>
         {user && (
           <NavLink to="/profile" className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900 flex items-center justify-center text-brand-700 dark:text-brand-300 font-bold text-xs border border-brand-200 dark:border-brand-800">
             {user.name.charAt(0)}
           </NavLink>
         )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto h-full w-full md:ml-72">
         {/* Add padding for top header on mobile, and bottom nav on mobile */}
         <div className="pt-20 pb-24 md:pt-8 md:pb-8 px-4 md:px-8 max-w-5xl mx-auto min-h-screen">
            <Outlet />
         </div>
      </main>

      <MobileBottomNav />
      <MobileMenuOverlay />
    </div>
  );
};

export default Layout;