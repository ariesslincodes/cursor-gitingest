import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const createClient = (useServiceRole = false) => {
  // Log which key we're using
  console.log('Using service role:', useServiceRole);

  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    useServiceRole
      ? process.env.SUPABASE_SERVICE_ROLE_KEY!
      : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
      },
    }
  );
};

export { createClient };
