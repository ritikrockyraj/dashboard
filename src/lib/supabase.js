import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://bljlzowhklbjuijyuqoh.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsamx6b3doa2xianVpanl1cW9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUxNjA3MTMsImV4cCI6MjEwMDczNjcxM30.xBe9e6ZlK19y_AI4RoFfr-esiqWTqtXr0M7LXSA2L2U';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
