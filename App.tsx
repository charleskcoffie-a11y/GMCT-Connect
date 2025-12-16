
import React, { useEffect, Suspense } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import Layout from './components/Layout';
import { LoadingScreen } from './components/UI';

// Lazy-loaded pages for route-level code splitting
const Welcome = React.lazy(() => import('./pages/Welcome'));
const Login = React.lazy(() => import('./pages/Login'));
const Home = React.lazy(() => import('./pages/Home'));
const Announcements = React.lazy(() => import('./pages/Announcements'));
const DailyVerse = React.lazy(() => import('./pages/DailyVerse'));
const Events = React.lazy(() => import('./pages/Events'));
const ServiceList = React.lazy(() => import('./pages/ServiceList'));
const Devotion = React.lazy(() => import('./pages/Devotion'));
const Hymnal = React.lazy(() => import('./pages/Hymnal'));
const Liturgical = React.lazy(() => import('./pages/Liturgical'));
const SickReports = React.lazy(() => import('./pages/Ministry/SickReports'));
const Profile = React.lazy(() => import('./pages/Profile'));
const Sermons = React.lazy(() => import('./pages/Sermons'));
const Settings = React.lazy(() => import('./pages/Settings'));
const NewHere = React.lazy(() => import('./pages/NewHere'));
const Locations = React.lazy(() => import('./pages/Locations'));
const Contact = React.lazy(() => import('./pages/Contact'));
const Organizations = React.lazy(() => import('./pages/Organizations'));

// New Portal Pages (lazy)
const PortalHome = React.lazy(() => import('./pages/Portal/PortalHome'));
const ClassManager = React.lazy(() => import('./pages/Portal/ClassLeader/ClassManager'));
const MinisterDashboard = React.lazy(() => import('./pages/Portal/Minister/MinisterDashboard'));
const ServicePlanner = React.lazy(() => import('./pages/Portal/Minister/ServicePlanner'));
const StewardDashboard = React.lazy(() => import('./pages/Portal/Steward/StewardDashboard'));
const PrayerRequestForm = React.lazy(() => import('./pages/Portal/Forms/PrayerRequestForm'));
const MessageMinisterForm = React.lazy(() => import('./pages/Portal/Forms/MessageMinisterForm'));
const MessageLeaderForm = React.lazy(() => import('./pages/Portal/Forms/MessageLeaderForm'));
const SMS = React.lazy(() => import('./pages/Portal/SMS'));

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
          <Suspense fallback={<LoadingScreen />}>
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
                  <Route path="message-leader" element={<MessageLeaderForm />} />
                  <Route path="sms" element={<SMS />} />
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
          </Suspense>
        </HashRouter>
      </SettingsProvider>
    </AuthProvider>
  );
};

export default App;
