'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { showToast } from '@/components/ToastContainer';
import { Header } from '../components/dashboard/Header';
import Link from 'next/link';

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
    <div className="min-h-screen bg-[#0A0A0A] p-8">
      <Header
        title="API Playground"
        breadcrumbs={['Pages', 'API Playground']}
        backButton={
          <Link
            href="/"
            className="inline-flex items-center justify-center text-sm font-medium text-gray-400 hover:text-white transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5 mr-2"
            >
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
            Back
          </Link>
        }
      />

      <div className="max-w-6xl">
        <div className="bg-[#1A1A1A] rounded-xl border border-gray-800 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Validate API Key
          </h2>
          <form onSubmit={handleSubmit} className="max-w-md">
            <div className="mb-4">
              <label
                htmlFor="apiKey"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
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
    </div>
  );
}
