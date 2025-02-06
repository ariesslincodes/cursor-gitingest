'use client';

import { useState, useEffect } from 'react';
import { apiKeyService } from '@/app/services/apiKeys';
import { Sidebar } from '@/app/components/Sidebar';
import { Header } from '@/app/components/dashboard/Header';
import { CurrentPlan } from '@/app/components/dashboard/CurrentPlan';
import { ApiKeyList } from '@/app/components/dashboard/ApiKeyList';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Providers } from '@/app/providers';
import { Toast } from '@/app/components/Toast';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  created_at: string;
  usage: number;
  monthly_limit?: number;
}

interface ToastInfo {
  message: string;
  type: 'success' | 'error';
}

export default function DashboardsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isSidebarOpen] = useState(true);
  const [toast, setToast] = useState<ToastInfo | null>(null);

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

  const handleToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    // Auto-dismiss toast after 3 seconds
    setTimeout(() => setToast(null), 3000);
  };

  // Show loading state while checking session
  if (status === 'loading' || !isClient) {
    return (
      <div className="min-h-screen p-8 max-w-6xl mx-auto bg-[#0A0A0A] text-white">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  // If user is not logged in, redirect to home
  if (!session) {
    router.push('/');
    return null;
  }

  return (
    <Providers>
      <div className="flex min-h-screen bg-[#0A0A0A]">
        <Sidebar />

        <main
          className={`flex-1 ${isSidebarOpen ? 'ml-64' : 'ml-0'} p-8 max-w-6xl`}
        >
          {toast && (
            <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
              <Toast
                message={toast.message}
                type={toast.type}
                onClose={() => setToast(null)}
              />
            </div>
          )}

          <Header title="Overview" breadcrumbs={['Pages', 'Overview']} />

          {error && (
            <div className="bg-red-900/20 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <CurrentPlan />

          <ApiKeyList
            apiKeys={apiKeys}
            onUpdate={fetchApiKeys}
            onToast={handleToast}
          />
        </main>
      </div>
    </Providers>
  );
}
