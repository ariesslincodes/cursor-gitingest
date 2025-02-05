'use client';

import { useState } from 'react';
import { apiKeyService } from '@/services/apiKeys';
import { showToast } from '@/components/ToastContainer';

interface CreateApiKeyModalProps {
  onClose: () => void;
  onKeyCreated: () => void;
}

export function CreateApiKeyModal({
  onClose,
  onKeyCreated,
}: CreateApiKeyModalProps) {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const newKey = await apiKeyService.createApiKey(name);
      showToast(
        'API key created successfully. Your key is: ' + newKey,
        'success'
      );
      onKeyCreated();
      onClose();
    } catch (error) {
      console.error('Error creating API key:', error);
      showToast('Failed to create API key', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-[#1A1A1A] rounded-xl p-6 max-w-md w-full">
        <h2 className="text-xl font-semibold text-white mb-4">
          Create New API Key
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Key Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#2A2A2A] border border-gray-700 rounded-lg px-3 py-2 text-white"
              placeholder="Enter a name for your API key"
              required
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 disabled:bg-gray-600"
            >
              {isLoading ? 'Creating...' : 'Create Key'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
