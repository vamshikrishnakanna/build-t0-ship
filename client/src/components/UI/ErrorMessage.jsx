/**
 * client/src/components/UI/ErrorMessage.jsx
 * Reusable error display component.
 */

import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 mb-4">
        <AlertCircle size={24} className="text-red-400" />
      </div>
      <h3 className="text-base font-semibold text-gray-200 mb-1">Something went wrong</h3>
      <p className="text-sm text-gray-500 max-w-sm mb-4">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-secondary text-xs gap-1.5">
          <RefreshCw size={13} />
          Try Again
        </button>
      )}
    </div>
  );
}
