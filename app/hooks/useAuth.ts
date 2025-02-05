'use client';

// Remove all Supabase related code
export function useAuth() {
  const user = { id: 'default-user' };

  return {
    user,
    loading: false,
    // Simple no-op functions since we don't need real auth
    signIn: () => {},
    signOut: () => {},
  };
}
