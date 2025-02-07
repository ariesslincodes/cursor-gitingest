import { ApiKey } from '@/types/api';
import { createClient } from '@/lib/supabase';

export interface UpdateApiKeyData {
  name: string;
  monthly_limit?: number;
}

interface ApiKeyValidationResult {
  isValid: boolean;
  error?: string;
  status?: number;
  keyData?: {
    user_id: string;
    usage: number;
    monthly_limit: number;
  };
}

interface RateLimitCheckResult {
  allowed: boolean;
  error?: string;
  status?: number;
}

export type { ApiKey };

export const apiKeyService = {
  async fetchApiKeys(): Promise<ApiKey[]> {
    try {
      const response = await fetch('/api/api-keys', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch API keys');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  },

  async createApiKey(name: string): Promise<string> {
    const response = await fetch('/api/api-keys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      throw new Error('Failed to create API key');
    }

    const data = await response.json();
    return data.key;
  },

  async updateApiKey(id: string, data: UpdateApiKeyData): Promise<void> {
    const requestConfig = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin' as const,
      body: JSON.stringify(data),
    };

    const response = await fetch(`/api/api-keys/${id}`, requestConfig);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to update API key');
    }
  },

  async deleteApiKey(id: string): Promise<void> {
    const requestConfig = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin' as const,
    };

    const response = await fetch(`/api/api-keys/${id}`, requestConfig);

    if (!response.ok) {
      throw new Error('Failed to delete API key');
    }
  },

  async validateKey(
    key: string
  ): Promise<{ isValid: boolean; error?: string }> {
    try {
      const response = await fetch('/api/api-keys/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key }),
      });

      const data = await response.json();
      return {
        isValid: response.ok,
        error: !response.ok ? data.error : undefined,
      };
    } catch (error) {
      console.error('API key validation error:', error);
      return {
        isValid: false,
        error:
          error instanceof Error ? error.message : 'Failed to validate API key',
      };
    }
  },

  async validateApiKeyWithUsage(
    apiKey: string
  ): Promise<ApiKeyValidationResult> {
    const supabase = createClient(true);

    const { data: keyData, error: keyError } = await supabase
      .from('api_keys')
      .select('user_id, usage, monthly_limit')
      .eq('key', apiKey)
      .single();

    if (keyError || !keyData) {
      return {
        isValid: false,
        error: 'Invalid or expired API key',
        status: 401,
      };
    }

    return {
      isValid: true,
      keyData,
    };
  },

  async checkAndIncrementUsage(
    apiKey: string,
    keyData: { usage: number; monthly_limit: number }
  ): Promise<RateLimitCheckResult> {
    // Check if usage is within limits
    if (keyData.usage >= keyData.monthly_limit) {
      return {
        allowed: false,
        error: `Rate limit exceeded. Usage: ${keyData.usage}/${keyData.monthly_limit} requests this month`,
        status: 429,
      };
    }

    // Increment usage
    const supabase = createClient(true);
    const { error: updateError } = await supabase
      .from('api_keys')
      .update({ usage: keyData.usage + 1 })
      .eq('key', apiKey);

    if (updateError) {
      return {
        allowed: false,
        error: 'Failed to update API key usage',
        status: 500,
      };
    }

    return {
      allowed: true,
    };
  },

  // Combined function for convenience
  async checkAndIncrementRateLimit(
    apiKey: string
  ): Promise<RateLimitCheckResult> {
    const validationResult = await this.validateApiKeyWithUsage(apiKey);

    if (!validationResult.isValid) {
      return {
        allowed: false,
        error: validationResult.error,
        status: validationResult.status,
      };
    }

    return this.checkAndIncrementUsage(apiKey, validationResult.keyData!);
  },
};
