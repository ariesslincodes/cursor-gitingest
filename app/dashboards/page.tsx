'use client';

import { useState, useEffect } from 'react';
import { apiKeyService } from '@/services/apiKeys';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { CurrentPlan } from '@/components/dashboard/CurrentPlan';
import { ApiKeyList } from '@/components/dashboard/ApiKeyList';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  created_at: string;
  usage: number;
  monthly_limit?: number;
}

export default function DashboardsPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isSidebarOpen] = useState(true);

  const fetchApiKeys = async () => {
    try {
      const data = await apiKeyService.fetchApiKeys();
      setApiKeys(data);
    } catch (err) {
      console.error('Error fetching API keys:', err);
      setError('Failed to fetch API keys');
    }
  };

  useEffect(() => {
    fetchApiKeys();
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen p-8 max-w-6xl mx-auto bg-[#0A0A0A] text-white">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0A0A0A]">
      <Sidebar />

      <main
        className={`flex-1 ${isSidebarOpen ? 'ml-64' : 'ml-0'} p-8 max-w-6xl`}
      >
        <Header title="Overview" breadcrumbs={['Pages', 'Overview']} />

        {error && (
          <div className="bg-red-900/20 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <CurrentPlan />

        <ApiKeyList apiKeys={apiKeys} onUpdate={fetchApiKeys} />
      </main>
    </div>
  );
}
