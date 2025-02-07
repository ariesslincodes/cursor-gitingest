'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiKeyService } from '@/app/services/apiKeys';
import { Sidebar } from '@/app/components/Sidebar';
import { Header } from '@/app/components/dashboard/Header';
import { CurrentPlan } from '@/app/components/dashboard/CurrentPlan';
import { ApiKeyList } from '@/app/components/dashboard/ApiKeyList';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Providers } from '@/app/providers';
import { Toast } from '@/app/components/Toast';
import { Menu } from 'lucide-react';
import { ApiKey } from '@/types/api';

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [toast, setToast] = useState<ToastInfo | null>(null);

  const fetchApiKeys = useCallback(async () => {
    try {
      if (!session) {
        setError('No active session');
        return;
      }
      const data = await apiKeyService.fetchApiKeys();
      setApiKeys(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch API keys');
    }
  }, [session]);

  useEffect(() => {
    if (session) {
      fetchApiKeys();
    }
    setIsClient(true);
  }, [session, fetchApiKeys]);

  const handleToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    // Auto-dismiss toast after 3 seconds
    setTimeout(() => setToast(null), 3000);
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Close sidebar when clicking outside on mobile
  const handleMainClick = () => {
    if (window.innerWidth < 1024 && isSidebarOpen) {
      setIsSidebarOpen(false);
    }
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
      <div className="flex min-h-screen bg-[#0A0A0A] relative">
        {/* Mobile menu button */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-800 text-white"
          aria-label="Toggle menu"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-30"
            onClick={toggleSidebar}
          />
        )}

        {/* Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main content */}
        <main
          onClick={handleMainClick}
          className={`
            flex-1 w-full min-h-screen
            transition-all duration-300 ease-in-out
            px-4 py-24 lg:py-8 lg:px-8
            ${isSidebarOpen ? 'lg:ml-[280px]' : 'lg:ml-0'}
          `}
        >
          <div className="max-w-6xl mx-auto">
            <Header
              title="Overview"
              breadcrumbs={['Pages', 'Overview']}
              className="mb-8"
            />

            {error && (
              <div className="bg-red-900/20 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <div className="space-y-6">
              <CurrentPlan />
              <ApiKeyList
                apiKeys={apiKeys}
                onUpdate={fetchApiKeys}
                onToast={handleToast}
              />
            </div>
          </div>

          {toast && (
            <div className="fixed top-4 right-4 z-50">
              <Toast
                message={toast.message}
                type={toast.type}
                onClose={() => setToast(null)}
              />
            </div>
          )}
        </main>
      </div>
    </Providers>
  );
}
