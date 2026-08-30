import { createClient } from "@supabase/supabase-js";

// Used only for the password-reset flow (resetPasswordForEmail / updateUser)
// — every other piece of admin data goes through our own Hono backend. The
// anon key is safe to expose client-side; it's what it's designed for.
export const supabaseBrowser = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
