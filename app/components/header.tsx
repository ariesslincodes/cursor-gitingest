import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/constants';
import { LoginButton } from './LoginButton';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export default function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          SuperCur
        </Link>

        {/* Mobile Menu */}
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="default" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col gap-4 pt-10">
                <Link href="#features">Features</Link>
                <Link href="#pricing">Pricing</Link>
                <Link href={ROUTES.DASHBOARD}>Dashboard</Link>
                <LoginButton />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden lg:flex items-center space-x-2">
          <Button variant="default" asChild>
            <Link href="#features">Features</Link>
          </Button>
          <Button variant="default" asChild>
            <Link href="#pricing">Pricing</Link>
          </Button>
          <Button variant="default" asChild>
            <Link href={ROUTES.DASHBOARD}>Dashboard</Link>
          </Button>
          <LoginButton />
        </nav>
      </div>
    </header>
  );
}
