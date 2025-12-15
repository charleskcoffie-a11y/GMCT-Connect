import * as firebaseApp from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getFunctions, Functions } from 'firebase/functions';

// Helper to safely access env vars without crashing if undefined
const getEnvVar = (key: string) => {
  try {
    // @ts-ignore
    return (import.meta as any).env?.[key];
  } catch (e) {
    return undefined;
  }
};

const firebaseConfig = {
  apiKey: getEnvVar('VITE_FIREBASE_API_KEY'),
  authDomain: getEnvVar('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnvVar('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: getEnvVar('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnvVar('VITE_FIREBASE_APP_ID')
};

let db: Firestore | null = null;
let auth: Auth | null = null;
let functions: Functions | null = null;
let isConfigured = false;

// Only initialize if we have at least a project ID
if (firebaseConfig.projectId && firebaseConfig.projectId !== 'placeholder') {
    try {
        // Use type assertion to bypass potential type definition mismatch for initializeApp
        const app = (firebaseApp as any).initializeApp(firebaseConfig);
        db = getFirestore(app);
        auth = getAuth(app);
        functions = getFunctions(app);
        isConfigured = true;
    } catch (error) {
        console.error("Firebase initialization failed:", error);
    }
}

export { db, auth, functions, isConfigured };