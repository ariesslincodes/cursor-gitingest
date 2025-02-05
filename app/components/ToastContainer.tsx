'use client';

import { useState, useEffect } from 'react';
import { Toast } from './Toast';

interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error';
}

let toastId = 0;

// Create a simple event system
type ShowToastFn = (message: string, type: 'success' | 'error') => void;
const listeners: Set<ShowToastFn> = new Set();

export function showToast(message: string, type: 'success' | 'error' = 'success') {
  listeners.forEach(listener => listener(message, type));
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const showToast: ShowToastFn = (message, type) => {
      const id = ++toastId;
      setToasts(prev => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 2000);
    };

    listeners.add(showToast);
    return () => {
      listeners.delete(showToast);
    };
  }, []);

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] pointer-events-none">
      <div className="inline-block pointer-events-auto">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
          />
        ))}
      </div>
    </div>
  );
} 