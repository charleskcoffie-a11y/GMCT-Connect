import React from 'react';
import { useAuth } from '../context/AuthContext';
import { PageHeader, Card, Button } from '../components/UI';
import { User, Mail, Shield, Bell } from 'lucide-react';

const Profile: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-xl mx-auto">
      <PageHeader title="Profile" />
      
      <Card className="mb-6 overflow-hidden">
          <div className="bg-brand-600 h-24"></div>
          <div className="px-6 pb-6">
              <div className="relative -mt-12 mb-4">
                  <div className="w-24 h-24 bg-white rounded-full p-1 shadow-lg">
                      <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-gray-400">
                          <User className="w-12 h-12" />
                      </div>
                  </div>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-gray-500 mb-4">{user.email}</p>
              
              <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-sm font-medium">
                      <Shield className="w-3 h-3" /> {user.role.replace('_', ' ').toUpperCase()}
                  </span>
                  {user.className && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-medium">
                          {user.className}
                      </span>
                  )}
              </div>
          </div>
      </Card>

      <Card className="p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Bell className="w-5 h-5" /> Notification Settings</h3>
          <div className="space-y-4">
              {['New Announcements', 'Daily Verse', 'Service Reminders', 'Prayer Updates'].map((setting, i) => (
                  <div key={i} className="flex items-center justify-between">
                      <span className="text-gray-700">{setting}</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
                      </label>
                  </div>
              ))}
          </div>
      </Card>
      
      <div className="mt-8 text-center text-gray-400 text-xs">
          Version 1.0.0 • Build 2023.11.20
      </div>
    </div>
  );
};

export default Profile;
