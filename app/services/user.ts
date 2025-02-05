import { createClient } from '@/lib/supabase';

export const userService = {
  async createOrUpdateUser(user: {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
  }) {
    // Log to verify we're using the service role
    console.log('Creating/updating user with service role client');
    const supabase = createClient(true);

    const { data, error } = await supabase
      .from('users')
      .upsert(
        {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar_url: user.image,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      )
      .select()
      .single();

    if (error) {
      console.error('Error upserting user:', error);
      throw error;
    }

    return data;
  },
};
