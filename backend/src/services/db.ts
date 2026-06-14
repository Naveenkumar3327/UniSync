import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

export const supabase = SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    })
  : null;

// Track if opportunities table is available to suppress schema cache errors
export let isOpportunitiesTableAvailable = false;

export async function checkTableAvailability() {
  if (!supabase) {
    isOpportunitiesTableAvailable = false;
    return;
  }
  try {
    const { error } = await supabase.from('opportunities').select('id').limit(1);
    if (!error) {
      isOpportunitiesTableAvailable = true;
      console.log('SyncAI Database: "opportunities" table verified and available.');
    } else {
      isOpportunitiesTableAvailable = false;
      console.warn(`SyncAI Database: "opportunities" table check: ${error.message}. Running in local fallback in-memory mode.`);
    }
  } catch (err: any) {
    isOpportunitiesTableAvailable = false;
    console.warn(`SyncAI Database: Failed to query Supabase opportunities table: ${err?.message || err}. Running in local fallback in-memory mode.`);
  }
}

if (supabase) {
  console.log('SyncAI Database: Supabase client initialized.');
  checkTableAvailability();
} else {
  console.warn('SyncAI Database: Supabase credentials missing. Running in local fallback in-memory mode.');
}

