import { LoginButton } from './components/LoginButton';
import { ServiceCard } from './components/ServiceCard';
import { ROUTES } from './lib/constants';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <header className="fixed top-0 left-0 right-0 p-4 border-b border-gray-800 bg-[#0A0A0A] z-50">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-white">SuperCur</h1>
          <LoginButton />
        </div>
      </header>
      <main className="pt-20 p-8 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome to SuperCur
          </h1>
          <p className="text-gray-400 text-lg">
            Your AI-powered research and development companion
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ServiceCard
            title="API Keys"
            description="Create and manage your API keys."
            href={ROUTES.DASHBOARD}
            buttonText="Manage Keys"
          />
          <ServiceCard
            title="API Playground"
            description="Test your API key and explore our API endpoints."
            href={ROUTES.PLAYGROUND}
            buttonText="Try it out"
          />
          <ServiceCard
            title="GitHub Summarizer"
            description="Get AI-powered summaries of any GitHub repository."
            href={ROUTES.GITHUB}
            buttonText="Summarize Repos"
          />
        </div>
      </main>
    </div>
  );
}
