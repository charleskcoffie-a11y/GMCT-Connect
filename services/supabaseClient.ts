import { createClient } from '@supabase/supabase-js';

// Safely access environment variables with optional chaining
// This prevents crashes if import.meta.env is undefined (e.g. in some runtime environments)
const getEnvVar = (key: string) => {
  try {
    // @ts-ignore
    return (import.meta as any).env?.[key];
  } catch (e) {
    return undefined;
  }
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL') || 'https://placeholder.supabase.co';
const supabaseKey = getEnvVar('VITE_SUPABASE_ANON_KEY') || 'placeholder';

export const supabase = createClient(supabaseUrl, supabaseKey);