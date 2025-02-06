'use client';

import {
  HomeIcon,
  UserIcon,
  CodeBracketIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ROUTES } from '@/lib/constants';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen }: SidebarProps) {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <aside
      className={`
        w-[280px] h-screen bg-[#0A0A0A] border-r border-gray-800 
        fixed lg:sticky top-0 
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        z-40
      `}
    >
      <div className="px-6 py-4 h-full overflow-y-auto">
        {/* Logo */}
        <div className="p-6 mt-8">
          <h1 className="text-2xl font-bold text-white">SuperCur</h1>
        </div>

        {/* Account Selector */}
        <div className="px-4 mb-6">
          <button className="w-full px-4 py-2 text-left text-gray-300 hover:bg-[#2A2A2A] rounded-lg flex items-center justify-between">
            <span>Personal</span>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4">
          <div className="space-y-1">
            <Link
              href="/dashboard"
              className={`flex items-center gap-3 px-4 py-2 rounded-lg ${
                isActive('/dashboard')
                  ? 'bg-[#2A2A2A] text-white'
                  : 'text-gray-400 hover:bg-[#2A2A2A] hover:text-white'
              }`}
            >
              <HomeIcon className="w-5 h-5" />
              <span>Overview</span>
            </Link>

            {/* GitHub Summarizer Link */}
            <Link
              href={ROUTES.GITHUB}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg ${
                isActive(ROUTES.GITHUB)
                  ? 'bg-[#2A2A2A] text-white'
                  : 'text-gray-400 hover:bg-[#2A2A2A] hover:text-white'
              }`}
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"
                />
              </svg>
              <span>GitHub Summarizer</span>
            </Link>

            <Link
              href="/playground"
              className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-colors ${
                isActive('/playground')
                  ? 'bg-white/10 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <CodeBracketIcon className="w-5 h-5" />
              API Playground
            </Link>

            <Link
              href="/account"
              className={`flex items-center gap-3 px-4 py-2 rounded-lg ${
                isActive('/account')
                  ? 'bg-[#2A2A2A] text-white'
                  : 'text-gray-400 hover:bg-[#2A2A2A] hover:text-white'
              }`}
            >
              <UserIcon className="w-5 h-5" />
              <span>My Account</span>
            </Link>

            <div className="flex items-center gap-3 px-4 py-2 text-gray-400 hover:bg-[#2A2A2A] hover:text-white rounded-lg cursor-pointer">
              <BookOpenIcon className="w-5 h-5" />
              <span>Documentation</span>
              <svg
                className="w-4 h-4 ml-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
}
