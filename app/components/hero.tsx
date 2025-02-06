import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/constants';

export default function Hero() {
  return (
    <section className="py-20 text-center">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-4">
          Supercharge Your GitHub Insights with SuperCur
        </h1>
        <p className="text-xl mb-8 text-muted-foreground">
          Get summaries, stars, cool facts, latest PRs, and version updates for
          any open-source repository.
        </p>
        <Button size="lg" asChild>
          <Link href={ROUTES.DASHBOARD}>Get Started for Free</Link>
        </Button>
      </div>
    </section>
  );
}
