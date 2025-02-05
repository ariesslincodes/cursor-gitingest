'use client';

import { useState } from 'react';
import { showToast } from '@/app/components/ToastContainer';
import { useAuth } from '@/app/hooks/useAuth';

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
  const [githubUrl, setGithubUrl] = useState('');
  const { user, apiKey } = useAuth();
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

      const data = await response.json();

      if (response.ok) {
        setSummary(data);
        showToast('Successfully generated summary', 'success');
      } else {
        showToast(data.error || 'Failed to generate summary', 'error');
      }
    } catch (err) {
      console.error('Error:', err);
      showToast('Failed to generate summary', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <div>Please sign in to use this feature</div>;
  }

  return (
    <div className="flex-1 p-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">GitHub Summarizer</h1>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm text-gray-400">Pages</span>
          <span className="text-sm text-gray-400">/</span>
          <span className="text-sm text-gray-400">GitHub Summarizer</span>
        </div>
      </div>

      <div className="bg-[#1A1A1A] rounded-xl border border-gray-800 p-6 mb-6">
        <h2 className="text-xl font-semibold text-white mb-4">
          Generate Repository Summary
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

          <div className="mb-4">
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
      </div>

      {isLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Generating summary...</p>
        </div>
      )}

      {summary && (
        <div className="bg-[#1A1A1A] rounded-xl border border-gray-800 p-6">
          <div className="mb-6">
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

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-2">Summary</h3>
            <p className="text-gray-300">{summary.summary}</p>
          </div>

          {summary.cool_facts && summary.cool_facts.length > 0 && (
            <div>
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

          <div className="mt-4 text-sm text-gray-400">
            Last updated:{' '}
            {new Date(summary.repository.lastUpdated).toLocaleDateString()}
          </div>
        </div>
      )}
    </div>
  );
}
