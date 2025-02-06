'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
      />
    </SessionProvider>
  );
}
