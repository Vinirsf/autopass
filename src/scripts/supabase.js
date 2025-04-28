import { createClient } from '@supabase/supabase-js';

// Estas variáveis ficarão no Netlify como ENV variables!
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
