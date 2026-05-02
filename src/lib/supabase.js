import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ofotvbwphblmsejjdtaa.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_0the0J2VqAcLWqo1xi5Ytw_YiV7Hiom';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
