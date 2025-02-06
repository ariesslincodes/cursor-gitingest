'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

// Example response to show when user clicks "Send Request"
const exampleResponse = {
  summary:
    'A project focused on analyzing and forecasting NFL player and game performance to provide valuable insights for teams, coaches, and analysts.',
  cool_facts: [
    'Utilizes player and game statistics to uncover trends, evaluate player performances, and predict future game outcomes.',
    'Employs K-Means clustering to categorize players into performance classes for various statistical categories.',
    'Provides interactive Tableau dashboards for visualizing player performance stats, game stats, and time series forecasts.',
  ],
  repository: {
    name: 'NFL-Data-Analysis',
    description: null,
    url: 'https://github.com/Deathstar1999/NFL-Data-Analysis',
    stars: 0,
    language: 'Jupyter Notebook',
    topics: [],
    lastUpdated: '2024-10-11T19:30:35Z',
  },
};

const defaultPayload = {
  githubUrl: 'https://github.com/Deathstar1999/NFL-Data-Analysis',
};

export default function ApiDemo() {
  const [payload, setPayload] = useState(
    JSON.stringify(defaultPayload, null, 2)
  );
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Parse the payload to validate it's proper JSON
      const parsedPayload = JSON.parse(payload);
      if (!parsedPayload.githubUrl) {
        throw new Error('githubUrl is required in the payload');
      }

      // Set example response
      setResponse(JSON.stringify(exampleResponse, null, 2));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="api-demo" className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">API Demo</h2>
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <p className="text-muted-foreground">
              Test our GitHub repository summarizer API in real-time
            </p>
            <Button variant="outline" asChild>
              <a href="/docs" className="flex items-center gap-2">
                View Documentation
              </a>
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>API Request Demo</CardTitle>
              <CardDescription>POST /api/github-summarizer</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="font-semibold">Request Payload</div>
                  <div className="relative">
                    <textarea
                      value={payload}
                      onChange={(e) => setPayload(e.target.value)}
                      className="w-full h-[400px] font-mono text-sm p-4 bg-slate-950 text-slate-50 rounded-md"
                      spellCheck="false"
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={handleSubmit} disabled={isLoading}>
                      {isLoading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Send Request
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="font-semibold">Response</div>
                  <div className="w-full h-[400px] font-mono text-sm p-4 bg-slate-950 text-slate-50 rounded-md overflow-auto">
                    {error ? (
                      <span className="text-red-400">{error}</span>
                    ) : response ? (
                      <pre>{response}</pre>
                    ) : (
                      <span className="text-slate-400">
                        No response yet. Send a request to see the response.
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
