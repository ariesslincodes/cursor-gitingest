'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { showToast } from '@/app/components/ToastContainer';
import { Header } from '../components/dashboard/Header';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { ROUTES } from '@/lib/constants';
import { Sidebar } from '../components/Sidebar';

export default function PlaygroundPage() {
  const { status } = useSession();
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const router = useRouter();

  // Show loading state while checking session
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#0A0A0A] p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-[#1A1A1A] rounded-xl border border-gray-800 p-6">
            <div className="animate-pulse">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  // If user is not logged in, redirect to home
  if (status === 'unauthenticated') {
    router.push(ROUTES.HOME);
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/validate-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey }),
      });

      const data = await response.json();

      if (response.ok) {
        showToast('API key validated successfully', 'success');
        window.location.href = ROUTES.PROTECTED;
      } else {
        const errorMessage = data.error || 'Invalid API key';
        setError(errorMessage);
        showToast(errorMessage, 'error');
      }
    } catch (err) {
      console.error('Error validating API key:', err);
      const errorMessage = 'Failed to validate API key';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0A0A0A]">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1 p-8">
        <Header
          title="API Playground"
          breadcrumbs={['Pages', 'API Playground']}
          showStatus={false}
          backButton={
            <Link
              href={ROUTES.DASHBOARD}
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
              Back to Dashboard
            </Link>
          }
        />

        <div className="max-w-4xl">
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
                  className={`w-full bg-[#2A2A2A] border ${
                    apiKey.length > 0 ? 'border-blue-500' : 'border-gray-700'
                  } rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter your API key"
                  required
                  disabled={isLoading}
                />
                <p className="mt-1 text-sm text-gray-400">
                  Enter your API key to validate and check usage limits
                </p>
              </div>
              <button
                type="submit"
                disabled={isLoading || !apiKey.trim()}
                className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed text-sm font-medium transition-colors"
              >
                {isLoading ? 'Validating...' : 'Validate Key'}
              </button>
            </form>
          </div>

          {error && (
            <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 mt-4 text-red-200">
              {error}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
