'use client';

import {
  CheckIcon,
  XMarkIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
  const bgColor = type === 'success' ? 'bg-green-600' : 'bg-red-600/90';
  const iconBgColor =
    type === 'success' ? 'hover:bg-green-700' : 'hover:bg-red-700';
  const icon =
    type === 'success' ? (
      <CheckIcon className="w-5 h-5" />
    ) : (
      <ExclamationCircleIcon className="w-5 h-5" />
    );

  return (
    <div
      className={`flex items-center gap-2 ${bgColor} text-white px-4 py-3 rounded-lg shadow-lg min-w-[300px] justify-between`}
      role="alert"
    >
      <div className="flex items-center gap-2">
        {icon}
        <span>{message}</span>
      </div>
      <button
        onClick={onClose}
        className={`p-1 rounded-md transition-colors ${iconBgColor}`}
        aria-label="Close"
      >
        <XMarkIcon className="w-4 h-4" />
      </button>
    </div>
  );
}
