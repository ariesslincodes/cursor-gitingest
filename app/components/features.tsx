import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Star, GitPullRequest, FileText, BarChart } from 'lucide-react';

const features = [
  {
    title: 'Repository Summaries',
    description: 'Get concise summaries of any GitHub repository at a glance.',
    icon: FileText,
  },
  {
    title: 'Star Tracking',
    description: 'Monitor star count and growth over time for repositories.',
    icon: Star,
  },
  {
    title: 'Cool Facts',
    description:
      'Discover interesting facts and statistics about repositories.',
    icon: BarChart,
  },
  {
    title: 'PR Insights',
    description: 'Stay updated on the latest important pull requests.',
    icon: GitPullRequest,
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index}>
              <CardHeader>
                <feature.icon className="w-10 h-10 mb-4 text-primary" />
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
