import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * Optional Supabase client. The MVP works fully offline against the local
 * store (see `useFamilyStore`); Supabase is the shared-persistence seam so the
 * family can populate one graph together.
 *
 * Configure `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` (see `.env.example`)
 * to enable it. When unset, `supabase` is `null` and callers fall back to local.
 */
const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase: SupabaseClient | null =
  url && anonKey ? createClient(url, anonKey) : null

export const isSupabaseConfigured = supabase !== null
