import { ApiKey } from '@/types/api';

export interface UpdateApiKeyData {
  name: string;
  monthly_limit?: number;
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

  async validateApiKey(
    key: string
  ): Promise<{ isValid: boolean; userId?: string }> {
    const response = await fetch('/api/api-keys/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ key }),
    });

    if (!response.ok) {
      return { isValid: false };
    }

    const data = await response.json();
    return data;
  },
};
