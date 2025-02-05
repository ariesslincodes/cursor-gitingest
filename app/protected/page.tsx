export default function ProtectedPage() {
  return (
    <div className="flex-1 p-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Protected Route</h1>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm text-gray-400">Pages</span>
          <span className="text-sm text-gray-400">/</span>
          <span className="text-sm text-gray-400">Protected</span>
        </div>
      </div>

      <div className="bg-[#1A1A1A] rounded-xl border border-gray-800 p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Protected Content</h2>
        <p className="text-gray-300">
          This page is only accessible with a valid API key.
        </p>
      </div>
    </div>
  );
} 