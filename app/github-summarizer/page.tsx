'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { showToast } from '@/app/components/ToastContainer';

interface SummaryResponse {
  summary: string;
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
  const [apiKey, setApiKey] = useState('');
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
          'X-API-KEY': apiKey
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
        <h2 className="text-xl font-semibold text-white mb-4">Generate Repository Summary</h2>
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

          <div className="mb-4">
            <label htmlFor="githubUrl" className="block text-sm font-medium text-gray-300 mb-2">
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

      {summary && (
        <div className="bg-[#1A1A1A] rounded-xl border border-gray-800 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Repository Summary</h2>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium text-white mb-2">
              <a href={summary.repository.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                {summary.repository.name}
              </a>
            </h3>
            <div className="flex gap-4 text-sm text-gray-400 mb-4">
              <span>⭐ {summary.repository.stars}</span>
              <span>🔤 {summary.repository.language}</span>
              <span>🕒 Last updated: {new Date(summary.repository.lastUpdated).toLocaleDateString()}</span>
            </div>
            {summary.repository.topics.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {summary.repository.topics.map(topic => (
                  <span key={topic} className="px-2 py-1 bg-[#2A2A2A] rounded-full text-xs text-gray-300">
                    {topic}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="prose prose-invert max-w-none">
            <div className="text-gray-300 whitespace-pre-wrap">{summary.summary}</div>
          </div>
        </div>
      )}
    </div>
  );
} 