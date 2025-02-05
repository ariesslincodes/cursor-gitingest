'use client';

import { CheckIcon, XMarkIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
  const bgColor = type === 'success' ? 'bg-green-600' : 'bg-red-600';
  const hoverColor = type === 'success' ? 'hover:bg-green-700' : 'hover:bg-red-700';

  return (
    <div className={`flex items-center gap-2 ${bgColor} text-white px-4 py-3 rounded-lg shadow-lg`}>
      {type === 'success' ? (
        <CheckIcon className="w-5 h-5" />
      ) : (
        <ExclamationCircleIcon className="w-5 h-5" />
      )}
      <span>{message}</span>
      <button
        onClick={onClose}
        className={`ml-2 p-1 ${hoverColor} rounded-md`}
      >
        <XMarkIcon className="w-4 h-4" />
      </button>
    </div>
  );
} 