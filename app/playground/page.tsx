'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { showToast } from '@/app/components/ToastContainer';

export default function PlaygroundPage() {
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/validate-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey }),
      });

      if (response.ok) {
        showToast('Valid API key, /protected can be accessed', 'success');
        router.push('/protected');
      } else {
        showToast('Invalid API key', 'error');
      }
    } catch (err) {
      console.error('Error validating API key:', err);
      showToast('Invalid API key', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 p-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">API Playground</h1>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm text-gray-400">Pages</span>
          <span className="text-sm text-gray-400">/</span>
          <span className="text-sm text-gray-400">API Playground</span>
        </div>
      </div>

      <div className="bg-[#1A1A1A] rounded-xl border border-gray-800 p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Validate API Key</h2>
        <form onSubmit={handleSubmit} className="max-w-md">
          <div className="mb-4">
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-300 mb-2">
              API Key
            </label>
            <input
              type="text"
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full bg-[#2A2A2A] border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your API key"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed text-sm font-medium transition-colors"
          >
            {isLoading ? 'Validating...' : 'Validate Key'}
          </button>
        </form>
      </div>
    </div>
  );
} 