'use client';

import { useState, useEffect } from 'react';
import { createClient, User } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [apiKey, setApiKey] = useState<string>('');

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      // You might want to fetch the API key from your database here
      // For now, we'll use a dummy key
      setApiKey('myown_izq6ndfi3zj2w5uiqc1zvo');
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return {
    user,
    apiKey,
    setApiKey,
    signIn: () => supabase.auth.signInWithOAuth({ provider: 'github' }),
    signOut: () => supabase.auth.signOut(),
  };
}
