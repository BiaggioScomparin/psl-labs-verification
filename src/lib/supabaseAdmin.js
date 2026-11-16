import { createClient } from '@supabase/supabase-js';

const DEFAULT_URL = 'https://banco.goib.org';
const DEFAULT_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzkxMDU1Mzk4LCJleHAiOjE5NDg3MzUzOTh9.nAQCEyt0GxZ1VWY_U2dOQMbysmQxTBCWJJrclJ_I0Pw';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || DEFAULT_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_KEY;

export const isSupabaseAdminConfigured = Boolean(
  supabaseUrl && 
  supabaseKey && 
  !supabaseUrl.includes('your-project') &&
  supabaseUrl.startsWith('https://')
);

// Server-side admin client
export const supabaseAdmin = isSupabaseAdminConfigured
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    })
  : null;
