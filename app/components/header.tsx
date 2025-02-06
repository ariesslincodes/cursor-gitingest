import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LoginButton } from './LoginButton';
import { Menu } from 'lucide-react';
import Image from 'next/image';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export default function Header() {
  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/dashboards',
      className: 'text-white hover:text-gray-300',
    },
  ];

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
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={item.className}
                  >
                    {item.name}
                  </Link>
                ))}
                <LoginButton />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden lg:flex items-center space-x-2">
          {navigationItems.map((item) => (
            <Button
              key={item.name}
              variant="ghost"
              className={item.className}
              asChild
            >
              <Link href={item.href}>{item.name}</Link>
            </Button>
          ))}
          <LoginButton />
        </nav>
      </div>
    </header>
  );
}
