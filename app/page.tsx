export default function HomePage() {
  return (
    <div className="flex min-h-screen bg-[#0A0A0A]">
      <main className="flex-1 p-8 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Welcome to SuperCur</h1>
          <p className="text-gray-400 text-lg">Your AI-powered research and development companion</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#1A1A1A] rounded-xl border border-gray-800 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">API Keys</h2>
            <p className="text-gray-400 mb-4">Create and manage your API keys.</p>
            <a 
              href="/dashboards"
              className="inline-block px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              Manage Keys
            </a>
          </div>

          <div className="bg-[#1A1A1A] rounded-xl border border-gray-800 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">API Playground</h2>
            <p className="text-gray-400 mb-4">Test your API key and explore our API endpoints.</p>
            <a 
              href="/playground"
              className="inline-block px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              Try it out
            </a>
          </div>

          <div className="bg-[#1A1A1A] rounded-xl border border-gray-800 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">GitHub Summarizer</h2>
            <p className="text-gray-400 mb-4">Get AI-powered summaries of any GitHub repository.</p>
            <a 
              href="/github-summarizer"
              className="inline-block px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              Summarize Repos
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
