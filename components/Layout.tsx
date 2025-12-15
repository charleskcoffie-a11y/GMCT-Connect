
import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from './UI';
import { 
  Home, Mic2, BookOpen, Calendar, Sun, 
  MessageCircle, Music, User as UserIcon, Settings,
  LayoutDashboard, Menu, X, LogOut, LogIn, Heart, MapPin, Mail, Users
} from 'lucide-react';
import { UserRole } from '../types';

const Layout: React.FC = () => {
  const { user, switchRoleMock, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // --- Configuration ---
  const NAV_ITEMS = [
    { to: "/dashboard", label: "Home", icon: Home, showInBottom: true },
    { to: "/service", label: "Service", icon: Sun, showInBottom: true },
    { to: "/hymnal", label: "Hymnal", icon: Music, showInBottom: true },
    { to: "/events", label: "Events", icon: Calendar, showInBottom: true },
    // Secondary Items (Menu)
    { to: "/organizations", label: "Organizations", icon: Users, showInBottom: false },
    { to: "/new-here", label: "New Here?", icon: Heart, showInBottom: false },
    { to: "/locations", label: "Locations", icon: MapPin, showInBottom: false },
    { to: "/contact", label: "Contact Us", icon: Mail, showInBottom: false },
    { to: "/portal", label: "My Portal", icon: LayoutDashboard, showInBottom: false },
    { to: "/announcements", label: "Announcements", icon: Mic2, showInBottom: false },
    { to: "/devotion", label: "Devotion", icon: MessageCircle, showInBottom: false },
    { to: "/verse", label: "Daily Verse", icon: BookOpen, showInBottom: false },
    { to: "/sermons", label: "Sermons", icon: Mic2, showInBottom: false },
    { to: "/liturgical", label: "Calendar", icon: Calendar, showInBottom: false },
    { to: "/profile", label: "Profile", icon: UserIcon, showInBottom: false },
  ];

  const DesktopSidebar = () => (
    <aside className="hidden md:flex fixed inset-y-0 left-0 z-50 w-72 bg-slate-900/50 backdrop-blur-xl border-r border-white/10 flex-col">
      <div className="p-6 border-b border-white/10 flex items-center gap-3 shrink-0">
        <div className="w-10 h-10 rounded-full bg-white/10 shadow-sm border border-white/20 p-1">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" onError={(e) => e.currentTarget.src='https://ui-avatars.com/api/?name=GMCT&background=1F4FD8&color=fff'} />
        </div>
        <div>
            <h1 className="text-xl font-bold text-white tracking-tight leading-none">GMCT Connect</h1>
            {user && (
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">
                {user.role.replace('_', ' ')}
            </div>
            )}
        </div>
      </div>

      <nav className="p-4 space-y-1 overflow-y-auto flex-1">
        {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 mb-1 ${
                  isActive 
                    ? 'bg-brand-600/20 text-brand-300 font-semibold border border-brand-500/20' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
        ))}

        {/* Admin Only Settings Link */}
        {user?.role === 'admin' && (
           <NavLink
             to="/settings"
             className={({ isActive }) =>
               `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 mb-1 ${
                 isActive 
                   ? 'bg-brand-600/20 text-brand-300 font-semibold border border-brand-500/20' 
                   : 'text-gray-400 hover:bg-white/5 hover:text-white'
               }`
             }
           >
             <Settings className="w-5 h-5" />
             <span>Settings</span>
           </NavLink>
        )}
      </nav>

      {/* Auth Control */}
      <div className="p-4 border-t border-white/10 shrink-0">
        {user ? (
            <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors"
            >
                <LogOut className="w-5 h-5" /> Sign Out
            </button>
        ) : (
            <NavLink 
                to="/login"
                className="w-full flex items-center gap-3 px-4 py-2 text-brand-400 hover:bg-brand-500/10 hover:text-brand-300 rounded-lg transition-colors"
            >
                <LogIn className="w-5 h-5" /> Sign In
            </NavLink>
        )}
      </div>
    </aside>
  );

  const MobileBottomNav = () => (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-nav-red border-t border-nav-red pb-[env(safe-area-inset-bottom)] z-50 flex justify-between items-center px-2 h-[4.5rem] shadow-[0_-4px_10px_-1px_rgba(0,0,0,0.3)]">
      {NAV_ITEMS.filter(i => i.showInBottom).map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-200 ${
              isActive ? 'text-white' : 'text-white/50 hover:text-white/80'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <item.icon className={`w-6 h-6 transition-all ${isActive ? 'scale-110 drop-shadow-sm' : ''}`} />
              <span className={`text-[10px] font-medium tracking-tight ${isActive ? 'font-bold' : ''}`}>{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
      <button 
        onClick={toggleMobileMenu}
        className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${mobileMenuOpen ? 'text-white' : 'text-white/50'}`}
      >
        <Menu className="w-6 h-6" />
        <span className="text-[10px] font-medium tracking-tight">Menu</span>
      </button>
    </div>
  );

  const MobileMenuOverlay = () => {
    if (!mobileMenuOpen) return null;
    return (
      <div className="md:hidden fixed inset-0 z-[60] bg-app-bg animate-in slide-in-from-bottom-10 fade-in duration-200 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-white/10 bg-slate-900/95 backdrop-blur-md">
           <span className="text-xl font-bold text-white">Menu</span>
           <button onClick={toggleMobileMenu} className="p-2 bg-white/10 rounded-full">
             <X className="w-5 h-5 text-white" />
           </button>
        </div>
        
        {/* User Card */}
        <div className="p-6 overflow-y-auto bg-gradient-to-b from-slate-900 to-app-bg h-full">
           {user ? (
            <div className="flex items-center gap-4 p-4 bg-brand-600 rounded-2xl text-white shadow-lg mb-6 border border-brand-500/50">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg border border-white/20">
                    {user.name.charAt(0)}
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-lg leading-tight">{user.name}</h3>
                    <p className="text-brand-100 text-xs uppercase font-semibold tracking-wide">{user.role.replace('_', ' ')}</p>
                </div>
                <button onClick={handleLogout} className="p-2 bg-black/20 rounded-full hover:bg-black/30">
                    <LogOut className="w-5 h-5" />
                </button>
            </div>
           ) : (
            <div className="mb-6">
                <Button onClick={() => navigate('/login')} className="w-full">Sign In</Button>
            </div>
           )}

           {/* Menu Grid */}
           <div className="grid grid-cols-2 gap-3 mb-6">
             {NAV_ITEMS.filter(i => !i.showInBottom).map(item => (
                <NavLink 
                  key={item.to} 
                  to={item.to}
                  onClick={toggleMobileMenu}
                  className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-md active:scale-95 transition-all text-gray-900"
                >
                   <div className="p-3 bg-brand-50 rounded-full mb-2 text-brand-700">
                      <item.icon className="w-6 h-6" />
                   </div>
                   <span className="font-medium text-sm">{item.label}</span>
                </NavLink>
             ))}
             
             {/* Admin Settings Button in Mobile Menu */}
             {user?.role === 'admin' && (
                <NavLink 
                  to="/settings"
                  onClick={toggleMobileMenu}
                  className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-md active:scale-95 transition-all text-gray-900"
                >
                   <div className="p-3 bg-gray-100 rounded-full mb-2 text-gray-700">
                      <Settings className="w-6 h-6" />
                   </div>
                   <span className="font-medium text-sm">Settings</span>
                </NavLink>
             )}
           </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-[100dvh] flex font-sans">
      <DesktopSidebar />
      
      {/* Mobile Top Header - Dark Glass */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900/40 backdrop-blur-md border-b border-white/10 flex items-center px-4 justify-between z-40">
         <div className="flex items-center gap-3">
            <div className="w-9 h-9 p-1 rounded-full bg-white/10 border border-white/20">
                <img src="/logo.png" alt="GMCT" className="w-full h-full object-contain" onError={(e) => e.currentTarget.src='https://ui-avatars.com/api/?name=GMCT&background=1F4FD8&color=fff'} />
            </div>
            <span className="font-bold text-lg text-white tracking-tight drop-shadow-sm">GMCT Connect</span>
         </div>
         {user ? (
           <NavLink to="/profile" className="w-8 h-8 rounded-full bg-brand-600 border border-brand-400 text-white flex items-center justify-center font-bold text-xs">
             {user.name.charAt(0)}
           </NavLink>
         ) : (
            <NavLink to="/login" className="text-xs font-bold text-white bg-white/20 px-3 py-1.5 rounded-full">Login</NavLink>
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
