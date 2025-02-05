'use client';

import React from 'react';

interface HeaderProps {
  title: string;
  breadcrumbs: string[];
  backButton?: React.ReactNode;
}

export function Header({ title, breadcrumbs, backButton }: HeaderProps) {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        {backButton && <div className="mb-4">{backButton}</div>}
        <h1 className="text-3xl font-bold text-white">{title}</h1>
        <div className="flex items-center gap-2 mt-1">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={crumb}>
              <span className="text-sm text-gray-400">{crumb}</span>
              {index < breadcrumbs.length - 1 && (
                <span className="text-sm text-gray-400">/</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
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
    </div>
  );
}
