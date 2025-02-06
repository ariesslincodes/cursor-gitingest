import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';

const plans = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for getting started',
    features: [
      '5 repository insights per month',
      'Basic summaries',
      'Star count tracking',
    ],
    comingSoon: false,
  },
  {
    name: 'Pro',
    price: '$9.99',
    description: 'For power users and small teams',
    features: [
      'Unlimited repository insights',
      'Advanced summaries',
      'PR insights',
      'Version update notifications',
    ],
    comingSoon: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For large organizations',
    features: [
      'All Pro features',
      'Custom integrations',
      'Priority support',
      'Team management',
    ],
    comingSoon: true,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Pricing</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={index === 1 ? 'border-primary relative' : 'relative'}
            >
              {plan.comingSoon && (
                <div className="absolute -top-3 right-2 bg-orange-400 text-white text-sm font-medium px-3 py-1 rounded-full">
                  Coming Soon
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold mb-4">{plan.price}</p>
                <ul className="space-y-2">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-2 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  variant={index === 1 ? 'default' : 'outline'}
                  disabled={plan.comingSoon}
                  style={
                    plan.comingSoon
                      ? { opacity: 0.5, cursor: 'not-allowed' }
                      : undefined
                  }
                >
                  {index === 2 ? 'Contact Sales' : 'Get Started'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
