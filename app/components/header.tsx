import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/constants';
import { LoginButton } from './LoginButton';
import { Menu } from 'lucide-react';
import Image from 'next/image';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export default function Header() {
  return (
    <header className="border-b border-gray-800 bg-black/80 backdrop-blur-sm fixed top-0 w-full z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt="SuperCur"
            width={32}
            height={32}
            className="invert"
          />
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            SuperCur
          </span>
        </Link>

        {/* Mobile Menu */}
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col gap-4 pt-10">
                <Link
                  href="#features"
                  className="text-lg font-medium text-gray-300 hover:text-white transition-colors"
                >
                  Features
                </Link>
                <Link
                  href="#pricing"
                  className="text-lg font-medium text-gray-300 hover:text-white transition-colors"
                >
                  Pricing
                </Link>
                <Link
                  href={ROUTES.DASHBOARD}
                  className="text-lg font-medium text-white"
                >
                  Dashboard
                </Link>
                <LoginButton />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden lg:flex items-center space-x-2">
          <Button
            variant="ghost"
            className="text-gray-300 hover:text-white hover:bg-gray-800"
            asChild
          >
            <Link href="#features">Features</Link>
          </Button>
          <Button
            variant="ghost"
            className="text-gray-300 hover:text-white hover:bg-gray-800"
            asChild
          >
            <Link href="#pricing">Pricing</Link>
          </Button>
          <Button
            variant="default"
            className="bg-white text-black hover:bg-gray-200"
            asChild
          >
            <Link href={ROUTES.DASHBOARD}>Dashboard</Link>
          </Button>
          <LoginButton />
        </nav>
      </div>
    </header>
  );
}
