'use client';

import { useState } from 'react';
import { ApiKey, apiKeyService } from '@/app/services/apiKeys';
import {
  EyeIcon,
  EyeSlashIcon,
  ClipboardIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { CreateApiKeyModal } from './CreateApiKeyModal';
import { EditApiKeyModal } from './EditApiKeyModal';

interface ApiKeyListProps {
  apiKeys: ApiKey[];
  onUpdate: () => void;
  onToast: (message: string, type: 'success' | 'error') => void;
}

export function ApiKeyList({ apiKeys, onUpdate, onToast }: ApiKeyListProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingKey, setEditingKey] = useState<ApiKey | null>(null);
  const [visibleKeyIds, setVisibleKeyIds] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (keyId: string) => {
    if (!window.confirm('Are you sure you want to delete this API key?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await apiKeyService.deleteApiKey(keyId);
      onToast('API key deleted successfully', 'error');
      onUpdate();
    } catch (error) {
      console.error('Failed to delete API key:', error);
      onToast('Failed to delete API key', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleKeyVisibility = (id: string) => {
    const newVisibleKeys = new Set(visibleKeyIds);
    if (visibleKeyIds.has(id)) {
      newVisibleKeys.delete(id);
    } else {
      newVisibleKeys.add(id);
    }
    setVisibleKeyIds(newVisibleKeys);
  };

  const handleCopy = (key: string) => {
    navigator.clipboard.writeText(key);
    onToast('API key copied to clipboard', 'success');
  };

  const maskApiKey = (key: string) => {
    return key.slice(0, 3) + '•'.repeat(37);
  };

  return (
    <>
      <div className="bg-[#1A1A1A] rounded-xl border border-gray-800">
        <div className="flex justify-between items-center p-6 border-b border-gray-800">
          <h2 className="text-xl font-semibold text-white">API Keys</h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed text-sm font-medium transition-colors"
          >
            + Create New Key
          </button>
        </div>

        <div className="divide-y divide-gray-800">
          {/* Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-3 text-sm font-medium text-gray-400">
            <div className="col-span-3">NAME</div>
            <div className="col-span-5">KEY</div>
            <div className="col-span-2">USAGE</div>
            <div className="col-span-2 text-right">OPTIONS</div>
          </div>

          {/* API Keys */}
          {apiKeys.map((key) => (
            <div
              key={key.id}
              className="grid grid-cols-12 gap-4 px-6 py-4 items-center"
            >
              <div className="col-span-3">
                <span className="font-medium text-white">{key.name}</span>
              </div>
              <div className="col-span-5">
                <code className="font-mono text-sm bg-[#2A2A2A] px-3 py-1.5 rounded-lg text-gray-300 w-full inline-block">
                  {visibleKeyIds.has(key.id) ? key.key : maskApiKey(key.key)}
                </code>
              </div>
              <div className="col-span-2 text-sm text-gray-400">
                {key.usage}
              </div>
              <div className="col-span-2 flex justify-end gap-2">
                <button
                  onClick={() => toggleKeyVisibility(key.id)}
                  className="p-1.5 hover:bg-[#2A2A2A] rounded-lg transition-colors"
                  title={
                    visibleKeyIds.has(key.id) ? 'Hide API key' : 'Show API key'
                  }
                >
                  {visibleKeyIds.has(key.id) ? (
                    <EyeSlashIcon className="w-5 h-5 text-gray-400 hover:text-white" />
                  ) : (
                    <EyeIcon className="w-5 h-5 text-gray-400 hover:text-white" />
                  )}
                </button>
                <button
                  onClick={() => handleCopy(key.key)}
                  className="p-1.5 hover:bg-[#2A2A2A] rounded-lg transition-colors"
                  title="Copy to clipboard"
                >
                  <ClipboardIcon className="w-5 h-5 text-gray-400 hover:text-white" />
                </button>
                <button
                  onClick={() => {
                    setEditingKey(key);
                    setShowEditModal(true);
                  }}
                  className="p-1.5 text-gray-400 hover:text-white hover:bg-[#2A2A2A] rounded-lg transition-colors"
                  title="Edit"
                >
                  <PencilIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(key.id)}
                  disabled={isDeleting}
                  className="p-1.5 text-gray-400 hover:text-white hover:bg-[#2A2A2A] rounded-lg transition-colors"
                  title="Delete"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showCreateModal && (
        <CreateApiKeyModal
          onClose={() => setShowCreateModal(false)}
          onKeyCreated={onUpdate}
        />
      )}

      <EditApiKeyModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSuccess={() => {
          onToast('API key updated successfully', 'success');
          onUpdate();
        }}
        onError={() => {
          onToast('Failed to update API key', 'error');
        }}
        apiKey={editingKey}
      />
    </>
  );
}
