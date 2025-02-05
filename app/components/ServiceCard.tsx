'use client';

import { useSession } from 'next-auth/react';
import { signIn } from 'next-auth/react';

interface ServiceCardProps {
  title: string;
  description: string;
  href: string;
  buttonText: string;
}

export function ServiceCard({
  title,
  description,
  href,
  buttonText,
}: ServiceCardProps) {
  const { data: session } = useSession();

  return (
    <div className="bg-[#1A1A1A] rounded-xl border border-gray-800 p-6">
      <h2 className="text-xl font-semibold text-white mb-4">{title}</h2>
      <p className="text-gray-400 mb-4">{description}</p>
      {session ? (
        <a
          href={href}
          className="inline-block px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
        >
          {buttonText}
        </a>
      ) : (
        <button
          onClick={() => signIn('google')}
          className="inline-block px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
}
