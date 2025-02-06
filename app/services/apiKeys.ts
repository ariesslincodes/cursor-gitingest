import { createClient } from '@supabase/supabase-js';

// Single instance of Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  created_at: string;
  monthly_limit?: number;
  usage: number;
}

interface UpdateApiKeyData {
  name: string;
  // other fields...
}

export const apiKeyService = {
  async fetchApiKeys() {
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async createApiKey(name: string = 'API Key'): Promise<string> {
    const key = `sk_${crypto.randomUUID()}`;
    const { error } = await supabase.from('api_keys').insert([
      {
        key: key,
        name: name,
        usage: 0,
        monthly_limit: 1000, // Optional: set a default limit
      },
    ]);

    if (error) throw error;
    return key;
  },

  async updateApiKey(id: string, data: UpdateApiKeyData) {
    const { error } = await supabase.from('api_keys').update(data).eq('id', id);

    if (error) throw error;
  },

  async deleteApiKey(id: string) {
    const { error } = await supabase.from('api_keys').delete().eq('id', id);

    if (error) throw error;
  },

  async validateApiKey(key: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('key', key)
      .single();

    if (error) return false;
    return !!data;
  },
};
