import { createClient } from '@supabase/supabase-js'
const supabaseUrl = "https://lyjtyqkpfeqorysrznch.supabase.co"
const supabaseAnonKey = "sb_publishable_F_Ln3lvymPJTUUhSO3wJJg_ZmwNxgtC"
export const supabase = createClient(supabaseUrl, supabaseAnonKey)