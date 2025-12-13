import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import Layout from './components/Layout';
import Welcome from './pages/Welcome';
import Home from './pages/Home';
import Announcements from './pages/Announcements';
import DailyVerse from './pages/DailyVerse';
import Events from './pages/Events';
import ServiceList from './pages/ServiceList';
import Devotion from './pages/Devotion';
import Hymnal from './pages/Hymnal';
import Liturgical from './pages/Liturgical';
import SickReports from './pages/Ministry/SickReports';
import Profile from './pages/Profile';
import Sermons from './pages/Sermons';
import Settings from './pages/Settings';

// New Portal Pages
import PortalHome from './pages/Portal/PortalHome';
import ClassManager from './pages/Portal/ClassLeader/ClassManager';
import MinisterDashboard from './pages/Portal/Minister/MinisterDashboard';
import StewardDashboard from './pages/Portal/Steward/StewardDashboard';
import PrayerRequestForm from './pages/Portal/Forms/PrayerRequestForm';
import MessageMinisterForm from './pages/Portal/Forms/MessageMinisterForm';

const App: React.FC = () => {
  // Initialize Theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <AuthProvider>
      <SettingsProvider>
        <HashRouter>
          <Routes>
            {/* Root Route is now the Welcome Landing Page */}
            <Route path="/" element={<Welcome />} />

            {/* App Layout Routes */}
            <Route element={<Layout />}>
              {/* The Main Dashboard is now at /dashboard */}
              <Route path="/dashboard" element={<Home />} />
              
              <Route path="/portal">
                <Route index element={<PortalHome />} />
                <Route path="class-manager" element={<ClassManager />} />
                <Route path="minister" element={<MinisterDashboard />} />
                <Route path="steward" element={<StewardDashboard />} />
                <Route path="prayer-request" element={<PrayerRequestForm />} />
                <Route path="message-minister" element={<MessageMinisterForm />} />
              </Route>

              <Route path="/announcements" element={<Announcements />} />
              <Route path="/verse" element={<DailyVerse />} />
              <Route path="/events" element={<Events />} />
              <Route path="/service" element={<ServiceList />} />
              <Route path="/devotion" element={<Devotion />} />
              <Route path="/hymnal" element={<Hymnal />} />
              <Route path="/liturgical" element={<Liturgical />} />
              <Route path="/sermons" element={<Sermons />} />
              
              {/* Legacy/Redirected Routes */}
              <Route path="/attendance" element={<Navigate to="/portal/class-manager" replace />} />
              <Route path="/prayers" element={<Navigate to="/portal/minister" replace />} />
              <Route path="/sick-reports" element={<SickReports />} />
              
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            
            {/* Catch all redirects to Welcome */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </HashRouter>
      </SettingsProvider>
    </AuthProvider>
  );
};

export default App;