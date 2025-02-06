import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link href="/" className="text-xl font-bold">
              SuperCur
            </Link>
            <p className="text-sm text-muted-foreground">
              © 2025 SuperCur. All rights reserved.
            </p>
          </div>
          <nav className="flex space-x-4">
            <Link href="#" className="text-sm hover:underline">
              Terms
            </Link>
            <Link href="#" className="text-sm hover:underline">
              Privacy
            </Link>
            <Link href="#" className="text-sm hover:underline">
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
