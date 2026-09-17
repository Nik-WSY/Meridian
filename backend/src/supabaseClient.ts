import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Copy .env.example to .env and fill in your cloud project's values (Project Settings -> API)."
  );
}

// Service role key bypasses Row Level Security entirely. Every query built with
// this client MUST filter by the authenticated user's id itself (see requireAuth.ts) -
// RLS is not doing that job for us on this connection.
export const supabase = createClient(supabaseUrl, serviceRoleKey);
