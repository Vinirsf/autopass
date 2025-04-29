import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// 🔥 Coloque sua URL e Key aqui diretamente:
const supabaseUrl = 'https://pgjcbjnlcmsjzabehthy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnamNiam5sY21zanphYmVodGh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4Nzc4NjMsImV4cCI6MjA2MTQ1Mzg2M30.g8_Xm_r2dbUZlO4haMwDOgXO-e2JsVGncnWltP1diC4'; // sua chave completa aqui

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
