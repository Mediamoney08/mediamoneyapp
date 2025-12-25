/**
 * Supabase Client - Root Level Import
 * 
 * This file provides a root-level import path for the Supabase client.
 * It re-exports the client from the main location at src/db/supabase.ts
 * 
 * Usage:
 * import { supabase } from '@/supabase';
 * 
 * Note: The primary Supabase client is located at src/db/supabase.ts
 */

export { supabase } from '@/db/supabase';
