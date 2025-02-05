'use client';

import { useState } from 'react';
import { HomeIcon, UserIcon, DocumentTextIcon, CodeBracketIcon, BookOpenIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-[#2A2A2A] text-gray-400 hover:text-white"
        title={isOpen ? "Hide sidebar" : "Show sidebar"}
      >
        {isOpen ? <ChevronLeftIcon className="w-6 h-6" /> : <ChevronRightIcon className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-64 bg-[#1A1A1A] border-r border-gray-800 flex flex-col transform transition-transform duration-200 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Logo */}
        <div className="p-6 mt-8">
          <h1 className="text-2xl font-bold text-white">SuperCur</h1>
        </div>

        {/* Account Selector */}
        <div className="px-4 mb-6">
          <button className="w-full px-4 py-2 text-left text-gray-300 hover:bg-[#2A2A2A] rounded-lg flex items-center justify-between">
            <span>Personal</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4">
          <div className="space-y-1">
            <Link 
              href="/dashboards" 
              className="flex items-center gap-3 px-4 py-2 text-white rounded-lg bg-[#2A2A2A]"
            >
              <HomeIcon className="w-5 h-5" />
              <span>Overview</span>
            </Link>

            <div className="flex items-center gap-3 px-4 py-2 text-gray-400 hover:bg-[#2A2A2A] hover:text-white rounded-lg cursor-pointer">
              <UserIcon className="w-5 h-5" />
              <span>My Account</span>
              <svg className="w-5 h-5 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            <Link 
              href="/assistant" 
              className="flex items-center gap-3 px-4 py-2 text-gray-400 hover:bg-[#2A2A2A] hover:text-white rounded-lg"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              <span>Research Assistant</span>
            </Link>

            <Link 
              href="/reports" 
              className="flex items-center gap-3 px-4 py-2 text-gray-400 hover:bg-[#2A2A2A] hover:text-white rounded-lg"
            >
              <DocumentTextIcon className="w-5 h-5" />
              <span>Research Reports</span>
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

            <div className="flex items-center gap-3 px-4 py-2 text-gray-400 hover:bg-[#2A2A2A] hover:text-white rounded-lg cursor-pointer">
              <BookOpenIcon className="w-5 h-5" />
              <span>Documentation</span>
              <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
} 