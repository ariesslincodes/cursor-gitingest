import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/constants';

export default function Hero() {
  return (
    <section className="relative py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-8">
            <span className="bg-gradient-to-r from-[#60A5FA] via-[#3B82F6] to-[#38BDF8] text-transparent bg-clip-text">
              Supercharge Your GitHub
            </span>
            <br />
            <span className="bg-gradient-to-r from-[#60A5FA] via-[#3B82F6] to-[#38BDF8] text-transparent bg-clip-text">
              Insights with SuperCur
            </span>
          </h1>
          <p className="text-xl mb-12 text-muted-foreground max-w-2xl mx-auto">
            Get summaries, stars, cool facts, latest PRs, and version updates
            for any open-source repository.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" variant="default" asChild>
              <Link href={ROUTES.DASHBOARD}>Get Started for Free</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#features">Learn More</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
