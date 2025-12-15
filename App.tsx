
import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import Layout from './components/Layout';
import Welcome from './pages/Welcome';
import Login from './pages/Login'; 
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
import NewHere from './pages/NewHere';
import Locations from './pages/Locations';
import Contact from './pages/Contact';
import Organizations from './pages/Organizations';

// New Portal Pages
import PortalHome from './pages/Portal/PortalHome';
import ClassManager from './pages/Portal/ClassLeader/ClassManager';
import MinisterDashboard from './pages/Portal/Minister/MinisterDashboard';
import ServicePlanner from './pages/Portal/Minister/ServicePlanner'; 
import StewardDashboard from './pages/Portal/Steward/StewardDashboard';
import PrayerRequestForm from './pages/Portal/Forms/PrayerRequestForm';
import MessageMinisterForm from './pages/Portal/Forms/MessageMinisterForm';
import MessageLeaderForm from './pages/Portal/Forms/MessageLeaderForm'; // New

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
            <Route path="/" element={<Welcome />} />
            <Route path="/login" element={<Login />} />

            {/* App Layout Routes */}
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Home />} />
              
              {/* Outreach Pages */}
              <Route path="/new-here" element={<NewHere />} />
              <Route path="/locations" element={<Locations />} />
              <Route path="/contact" element={<Contact />} />
              
              <Route path="/portal">
                <Route index element={<PortalHome />} />
                <Route path="class-manager" element={<ClassManager />} />
                <Route path="minister" element={<MinisterDashboard />} />
                <Route path="service-planner" element={<ServicePlanner />} />
                <Route path="steward" element={<StewardDashboard />} />
                <Route path="prayer-request" element={<PrayerRequestForm />} />
                <Route path="message-minister" element={<MessageMinisterForm />} />
                <Route path="message-leader" element={<MessageLeaderForm />} /> {/* New Route */}
              </Route>

              <Route path="/announcements" element={<Announcements />} />
              <Route path="/verse" element={<DailyVerse />} />
              <Route path="/events" element={<Events />} />
              <Route path="/service" element={<ServiceList />} />
              <Route path="/devotion" element={<Devotion />} />
              <Route path="/hymnal" element={<Hymnal />} />
              <Route path="/liturgical" element={<Liturgical />} />
              <Route path="/sermons" element={<Sermons />} />
              <Route path="/organizations" element={<Organizations />} />
              
              <Route path="/attendance" element={<Navigate to="/portal/class-manager" replace />} />
              <Route path="/prayers" element={<Navigate to="/portal/minister" replace />} />
              <Route path="/sick-reports" element={<SickReports />} />
              
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </HashRouter>
      </SettingsProvider>
    </AuthProvider>
  );
};

export default App;
