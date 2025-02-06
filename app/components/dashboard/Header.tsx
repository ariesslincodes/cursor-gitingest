'use client';

import React from 'react';

interface HeaderProps {
  title: string;
  breadcrumbs: string[];
  className?: string;
  backButton?: React.ReactNode;
  showStatus?: boolean;
}

export function Header({
  title,
  breadcrumbs,
  className = '',
  backButton,
  showStatus = true,
}: HeaderProps) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <div className="flex items-center gap-2 text-sm text-gray-400">
        {breadcrumbs.map((crumb, index) => (
          <div key={crumb} className="flex items-center gap-2">
            {index > 0 && <span>/</span>}
            <span>{crumb}</span>
          </div>
        ))}
      </div>
      <h1 className="text-2xl font-bold text-white">{title}</h1>
      {backButton && <div className="mb-4">{backButton}</div>}
      {showStatus && (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-300">Operational</span>
          </div>
          <button
            onClick={() => (window.location.href = '/')}
            className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
          >
            ← Back
          </button>
        </div>
      )}
    </div>
  );
}
