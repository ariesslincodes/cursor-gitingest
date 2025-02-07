'use client';

import {
  HomeIcon,
  UserIcon,
  CodeBracketIcon,
  BookOpenIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ROUTES } from '@/lib/constants';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isActive = (path: string) => pathname === path;

  return (
    <aside
      className={`
        w-[280px] h-screen bg-[#0A0A0A] border-r border-gray-800 
        fixed lg:relative top-0 
        transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0 w-[280px]' : '-translate-x-full w-0 lg:w-0'}
        z-40
        flex flex-col
      `}
    >
      {/* Toggle button for desktop */}
      <button
        onClick={onClose}
        className="hidden lg:flex absolute -right-8 top-1/2 transform -translate-y-1/2 
          bg-[#0A0A0A] border border-gray-800 rounded-r-md p-2 
          text-gray-400 hover:text-white transition-colors"
      >
        {isOpen ? (
          <ChevronLeftIcon className="w-4 h-4" />
        ) : (
          <ChevronRightIcon className="w-4 h-4" />
        )}
      </button>

      <div className="px-6 py-4 h-full overflow-y-auto flex flex-col">
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

        {/* User Profile Section - at the bottom */}
        {session?.user && (
          <div className="mt-auto border-t border-gray-800 pt-4 mb-4">
            <div className="flex items-center gap-3 px-4 py-2 rounded-lg">
              {session.user.image ? (
                <div className="relative w-10 h-10 rounded-full overflow-hidden">
                  <Image
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                  <UserIcon className="w-6 h-6 text-gray-300" />
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-sm font-medium text-white">
                  {session.user.name || 'User'}
                </span>
                <span className="text-xs text-gray-400">
                  {session.user.email}
                </span>
              </div>
            </div>
            <button
              onClick={() => signOut()}
              className="w-full mt-2 flex items-center gap-2 px-4 py-2 text-gray-400 hover:bg-[#2A2A2A] hover:text-white rounded-lg transition-colors"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
