import { createClient } from '@supabase/supabase-js';

// Get Supabase URL and anon key from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Check if environment variables are loaded
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL or anon key is missing. Check your .env.local file.');
}

// Initialize the Supabase client
// The <Database> generic type can be used if you have generated types from your Supabase schema.
// For now, we can omit it or use a basic 'any' if no specific DB types are set up.
// Example without specific DB types: const supabase = createClient(supabaseUrl, supabaseAnonKey);
// If you have a types file for your database (e.g., from `supabase gen types typescript > types/supabase.ts`):
// import { Database } from '@/types/supabase'; // Adjust path as needed
// const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
