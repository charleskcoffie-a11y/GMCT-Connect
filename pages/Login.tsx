
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { Card, Button, LoadingScreen } from '../components/UI';
import { Church, AlertCircle, Shield } from 'lucide-react';
import { UserRole } from '../types';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { loginMock } = useAuth();
  
  const [isLogin, setIsLogin] = useState(true);
  const [selectedRole, setSelectedRole] = useState<UserRole>('member');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // Only for signup
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Auto-fill mock credentials when role changes (Dev convenience)
  useEffect(() => {
      if (!auth) {
          setEmail(`${selectedRole}@gmct.com`);
          setPassword('password123');
      }
  }, [selectedRole]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // --- MOCK MODE (No Firebase) ---
    if (!auth) {
        await loginMock(selectedRole);
        navigate('/dashboard');
        return;
    }

    // --- FIREBASE MODE ---
    try {
        if (isLogin) {
            await signInWithEmailAndPassword(auth, email, password);
        } else {
            // Register flow
            const cred = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(cred.user, { displayName: name });
            
            // Create Firestore User Doc
            const db = getFirestore();
            await setDoc(doc(db, 'users', cred.user.uid), {
                name: name,
                email: email,
                role: 'member' as UserRole, // Default role
                createdAt: new Date().toISOString()
            });
        }
        navigate('/dashboard');
    } catch (err: any) {
        console.error(err);
        setError(err.message || "Authentication failed.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-app-bg">
      <Card className="w-full max-w-md p-8 shadow-2xl border-white/10">
        <div className="text-center mb-8">
            <div className="w-16 h-16 bg-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-900/50">
                <Church className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">GMCT Connect</h1>
            <p className="text-gray-500 text-sm mt-1">{isLogin ? 'Sign in to your account' : 'Join the community'}</p>
        </div>

        {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> {error}
            </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
            
            {/* Role Selector (Visible mostly for Mock/Dev/Demo usage) */}
            <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                <label className="block text-xs font-bold text-blue-800 uppercase tracking-wide mb-2 flex items-center gap-1">
                    <Shield className="w-3 h-3" /> Select Role (Demo Mode)
                </label>
                <select 
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                    className="w-full p-2 border border-blue-200 rounded-lg bg-white text-sm focus:ring-2 focus:ring-brand-500 outline-none text-gray-700 font-medium"
                >
                    <option value="member">Member</option>
                    <option value="class_leader">Class Leader</option>
                    <option value="rev_minister">Rev. Minister</option>
                    <option value="society_steward">Society Steward</option>
                    <option value="admin">Admin</option>
                </select>
            </div>

            {!isLogin && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input 
                        type="text" 
                        required 
                        className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-brand-500 outline-none"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                </div>
            )}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input 
                    type="email" 
                    required 
                    className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-brand-500 outline-none"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input 
                    type="password" 
                    required 
                    minLength={6}
                    className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-brand-500 outline-none"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
            </div>

            <Button type="submit" isLoading={loading} className="w-full py-3 text-lg mt-4 shadow-lg">
                {isLogin ? 'Sign In' : 'Create Account'}
            </Button>
        </form>

        <div className="mt-6 text-center">
            <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-brand-600 font-semibold hover:underline"
            >
                {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </button>
        </div>
      </Card>
    </div>
  );
};

export default Login;
