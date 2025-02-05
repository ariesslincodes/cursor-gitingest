'use client';

import { useState } from 'react';
import { Header } from '@/app/components/dashboard/Header';
import { showToast } from '@/app/components/ToastContainer';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants';

interface SummaryResponse {
  summary: string;
  cool_facts: string[];
  repository: {
    name: string;
    description: string;
    stars: number;
    language: string;
    topics: string[];
    lastUpdated: string;
    url: string;
  };
}

export default function GitHubSummarizerPage() {
  const [apiKey, setApiKey] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<SummaryResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSummary(null);

    try {
      const response = await fetch('/api/github-summarizer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ githubUrl }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to summarize repository');
      }

      const data = await response.json();
      setSummary(data);
    } catch (error) {
      console.error('Error:', error);
      showToast(
        error instanceof Error ? error.message : 'An error occurred',
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-8">
      <Header
        title="GitHub Repository Summarizer"
        breadcrumbs={['Pages', 'GitHub Summarizer']}
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

      <div className="max-w-6xl">
        <div className="bg-[#1A1A1A] rounded-xl border border-gray-800 p-6">
          <form onSubmit={handleSubmit} className="max-w-xl">
            <div className="mb-6">
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

            <div className="mb-6">
              <label
                htmlFor="githubUrl"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                GitHub Repository URL
              </label>
              <input
                type="url"
                id="githubUrl"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="w-full bg-[#2A2A2A] border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://github.com/owner/repo"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed text-sm font-medium transition-colors"
            >
              {isLoading ? 'Generating...' : 'Generate Summary'}
            </button>
          </form>

          {isLoading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-400">Generating summary...</p>
            </div>
          )}

          {summary && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-white mb-2">
                Repository Info
              </h3>
              <div className="flex items-center gap-4 text-sm text-gray-300">
                <a
                  href={summary.repository.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  {summary.repository.name}
                </a>
                <span>⭐ {summary.repository.stars}</span>
                {summary.repository.language && (
                  <span>{summary.repository.language}</span>
                )}
              </div>
            </div>
          )}

          {summary && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-white mb-2">Summary</h3>
              <p className="text-gray-300">{summary.summary}</p>
            </div>
          )}

          {summary && summary.cool_facts && summary.cool_facts.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-white mb-2">
                Key Findings
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                {summary.cool_facts.map((fact, index) => (
                  <li key={index}>{fact}</li>
                ))}
              </ul>
            </div>
          )}

          {summary && (
            <div className="mt-4 text-sm text-gray-400">
              Last updated:{' '}
              {new Date(summary.repository.lastUpdated).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
