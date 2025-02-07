import { CoolFact } from '@/app/services/chain';

interface SummaryProps {
  summary: string;
  coolFacts: CoolFact[];
}

export function Summary({ summary, coolFacts }: SummaryProps) {
  return (
    <div className="space-y-6">
      <div className="prose dark:prose-invert max-w-none">
        <h2 className="text-xl font-semibold text-white/90 mb-4">Summary</h2>
        <p className="text-gray-200">{summary}</p>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-white/90 mb-4">Cool Facts</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {coolFacts.map((fact, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-lg p-4 border border-gray-700"
            >
              <h3 className="text-lg font-medium mb-2 text-blue-400">
                {fact.title}
              </h3>
              <p className="text-gray-300">{fact.description}</p>
              <span className="inline-block mt-2 text-xs font-medium px-2 py-1 rounded-full bg-gray-700 text-gray-300">
                {fact.category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
