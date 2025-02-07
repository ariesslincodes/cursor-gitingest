'use client';

import { useState } from 'react';
import { Header } from '@/app/components/dashboard/Header';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants';
import { Summary } from '../components/summary';
import { SummaryResponse } from '../services/chain';

export default function GitHubSummarizerPage() {
  const [apiKey, setApiKey] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/github-summarizer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ githubUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate summary');
      }

      setSummary(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
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

      <div className="max-w-4xl mx-auto">
        <div className="bg-[#1A1A1A] rounded-xl border border-gray-800 p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">
            GitHub Repository Summarizer
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
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
            <div>
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
                placeholder="https://github.com/user/repo"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Generating...' : 'Generate Summary'}
            </button>
          </form>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 mb-8 text-red-200">
            {error}
          </div>
        )}

        {summary && (
          <div className="bg-[#1A1A1A] rounded-xl border border-gray-800 p-6">
            <div className="mb-6">
              <div className="flex items-center gap-4 text-sm text-gray-300">
                <a
                  href={summary.metadata.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  {summary.metadata.name}
                </a>
                <span>•</span>
                <span>{summary.metadata.stars.toLocaleString()} stars</span>
                <span>•</span>
                <span>{summary.metadata.language}</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {summary.metadata.topics.map((topic) => (
                  <span
                    key={topic}
                    className="px-2 py-1 text-xs bg-gray-800 rounded-full text-gray-300"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            <Summary summary={summary.summary} coolFacts={summary.cool_facts} />
          </div>
        )}
      </div>
    </div>
  );
}
