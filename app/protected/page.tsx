import { Header } from '../components/dashboard/Header';
import { ROUTES } from '@/lib/constants';
import Link from 'next/link';

export default function ProtectedPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] p-8">
      <Header
        title="Protected Route"
        breadcrumbs={['Pages', 'Protected']}
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
          <h2 className="text-xl font-semibold text-white mb-4">
            Protected Content
          </h2>
          <p className="text-gray-300">
            This page is only accessible with a valid API key.
          </p>
        </div>
      </div>
    </div>
  );
}
