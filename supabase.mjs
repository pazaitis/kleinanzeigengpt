import { createClient } from '@supabase/supabase-js'

// Create a Supabase client with the anon key for client-side operations
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

// Create a Supabase admin client only on the server side
export const supabaseAdmin = typeof window === 'undefined' 
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    )
  : null 