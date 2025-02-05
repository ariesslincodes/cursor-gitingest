'use client';

interface HeaderProps {
  title: string;
  breadcrumbs: string[];
}

export function Header({ title, breadcrumbs }: HeaderProps) {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-white">{title}</h1>
        <div className="flex items-center gap-2 mt-1">
          {breadcrumbs.map((crumb, index) => (
            <span key={crumb} className="text-sm text-gray-400">
              {index > 0 && <span className="mx-2">/</span>}
              {crumb}
            </span>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-300">Operational</span>
        </div>
        <button
          onClick={() => window.location.href = '/'}
          className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
        >
          ← Back
        </button>
      </div>
    </div>
  );
} 