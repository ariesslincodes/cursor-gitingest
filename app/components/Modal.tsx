'use client';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />
        <div className="relative bg-[#1A1A1A] rounded-xl border border-gray-800 w-full max-w-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">{title}</h2>
          {children}
        </div>
      </div>
    </div>
  );
} 