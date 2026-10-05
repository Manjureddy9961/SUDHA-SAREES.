import { createClient } from '@supabase/supabase-js';

// Sanitize the URL to prevent "Invalid path specified in request URL" errors
let rawUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim().replace(/\/+$/, '');

// If the user accidentally pasted the dashboard URL, automatically extract the API project URL
if (rawUrl.includes('/dashboard/project/')) {
  const match = rawUrl.match(/\/project\/([a-z0-9_-]+)/i);
  if (match && match[1]) {
    rawUrl = `https://${match[1]}.supabase.co`;
  }
}

const supabaseUrl = rawUrl;
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

export const isSupabaseConfigured = () => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('your-project-id') &&
    supabaseUrl.startsWith('https://')
  );
};

// Create the Supabase client instance (or a dummy if not yet configured)
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      }
    })
  : null;

if (!isSupabaseConfigured()) {
  console.info(
    '%c[Sudha Sarees] Notice: Running in Local Standalone Preview Mode.\nTo connect live Supabase Postgres & Auth, set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.',
    'color: #C9A24B; font-weight: bold; font-size: 12px;'
  );
} else {
  console.info(
    '%c[Sudha Sarees] Connected to Supabase Cloud Backend successfully: ' + supabaseUrl,
    'color: #0D5C5A; font-weight: bold; font-size: 12px;'
  );
}
