import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY

// Prevent app crash if keys are missing (during dev)
export const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey)
  : null

if (!supabase) {
  console.warn('Supabase keys are missing! Authentication will not work.')
}

export default function () {
  // This does not perform any initialization but allows usage in other files
}
