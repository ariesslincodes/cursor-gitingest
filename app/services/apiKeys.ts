import { supabase } from '@/lib/supabase';

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  created_at: string;
  monthly_limit?: number;
  usage: number;
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

  async createApiKey(newKey: Omit<ApiKey, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('api_keys')
      .insert([newKey])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateApiKey(id: string, name: string) {
    const { error } = await supabase
      .from('api_keys')
      .update({ name })
      .eq('id', id);

    if (error) throw error;
  },

  async deleteApiKey(id: string) {
    const { error } = await supabase
      .from('api_keys')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async validateApiKey(key: string): Promise<boolean> {
    try {
      const { data: apiKeys } = await supabase
        .from('api_keys')
        .select('*')
        .eq('key', key)
        .single();
      
      return !!apiKeys;
    } catch (error) {
      console.error('Error validating API key:', error);
      return false;
    }
  },
}; 