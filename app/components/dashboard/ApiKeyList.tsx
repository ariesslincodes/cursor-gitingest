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
    return `${key.slice(0, 3)}${'•'.repeat(20)}`;
  };

  return (
    <>
      <div className="rounded-lg border border-gray-800">
        <div className="p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">API Keys</h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors"
          >
            + Create New Key
          </button>
        </div>

        <div className="w-full">
          {/* Mobile view */}
          <div className="md:hidden">
            {apiKeys.map((key) => (
              <div key={key.id} className="border-t border-gray-800 p-4">
                <div className="space-y-4">
                  {/* Info row */}
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <div className="text-sm text-gray-400">NAME</div>
                      <div className="text-white truncate">{key.name}</div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-400">KEY</div>
                      <div className="text-gray-400 font-mono truncate">
                        {visibleKeyIds.has(key.id) ? (
                          <span>{key.key}</span>
                        ) : (
                          <span>{maskApiKey(key.key)}</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-400">USAGE</div>
                      <div className="text-gray-400">{key.usage}</div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => toggleKeyVisibility(key.id)}
                      className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors"
                      title={
                        visibleKeyIds.has(key.id)
                          ? 'Hide API key'
                          : 'Show API key'
                      }
                    >
                      {visibleKeyIds.has(key.id) ? (
                        <EyeSlashIcon className="w-4 h-4 text-gray-400" />
                      ) : (
                        <EyeIcon className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                    <button
                      onClick={() => handleCopy(key.key)}
                      className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors"
                      title="Copy to clipboard"
                    >
                      <ClipboardIcon className="w-4 h-4 text-gray-400" />
                    </button>
                    <button
                      onClick={() => {
                        setEditingKey(key);
                        setShowEditModal(true);
                      }}
                      className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <PencilIcon className="w-4 h-4 text-gray-400" />
                    </button>
                    <button
                      onClick={() => handleDelete(key.id)}
                      disabled={isDeleting}
                      className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <TrashIcon className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop view */}
          <div className="hidden md:block">
            <table className="w-full">
              <thead className="border-y border-gray-800">
                <tr>
                  <th className="text-left p-4 text-gray-400 font-medium">
                    NAME
                  </th>
                  <th className="text-left p-4 text-gray-400 font-medium">
                    KEY
                  </th>
                  <th className="text-left p-4 text-gray-400 font-medium">
                    USAGE
                  </th>
                  <th className="text-left p-4 text-gray-400 font-medium">
                    OPTIONS
                  </th>
                </tr>
              </thead>
              <tbody>
                {apiKeys.map((key) => (
                  <tr key={key.id} className="border-t border-gray-800">
                    <td className="p-4 text-white">{key.name}</td>
                    <td className="p-4 text-gray-400 font-mono">
                      {visibleKeyIds.has(key.id) ? (
                        <span>{key.key}</span>
                      ) : (
                        <span>{maskApiKey(key.key)}</span>
                      )}
                    </td>
                    <td className="p-4 text-gray-400">{key.usage}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleKeyVisibility(key.id)}
                          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                          title={
                            visibleKeyIds.has(key.id)
                              ? 'Hide API key'
                              : 'Show API key'
                          }
                        >
                          {visibleKeyIds.has(key.id) ? (
                            <EyeSlashIcon className="w-5 h-5 text-gray-400" />
                          ) : (
                            <EyeIcon className="w-5 h-5 text-gray-400" />
                          )}
                        </button>
                        <button
                          onClick={() => handleCopy(key.key)}
                          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                          title="Copy to clipboard"
                        >
                          <ClipboardIcon className="w-5 h-5 text-gray-400" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingKey(key);
                            setShowEditModal(true);
                          }}
                          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <PencilIcon className="w-5 h-5 text-gray-400" />
                        </button>
                        <button
                          onClick={() => handleDelete(key.id)}
                          disabled={isDeleting}
                          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <TrashIcon className="w-5 h-5 text-gray-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
