import { useState } from 'react';
import { ApiClient } from '../lib/api';
import { showToast } from '../components/ToastContainer';

export function useApi<T>() {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const execute = async (
    method: 'get' | 'post',
    endpoint: string,
    payload?: Record<string, unknown>
  ) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await (method === 'get'
        ? ApiClient.get<T>(endpoint)
        : ApiClient.post<T>(endpoint, payload));
      setData(result);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      showToast(message, 'error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { data, error, isLoading, execute };
}
