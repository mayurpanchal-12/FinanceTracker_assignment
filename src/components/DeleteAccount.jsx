import { useState } from 'react';
import { createPortal } from 'react-dom';

// Clears all localStorage data for this app
const KEYS = [
  'finance_tracker_transactions',
  'finance_tracker_filters',
  'finance_tracker_budgets',
];

export default function DeleteAccount() {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = () => {
    KEYS.forEach((k) => localStorage.removeItem(k));
    window.location.reload();
  };

  return (
    <>
      {!showConfirm ? (
        <button
          onClick={(e) => { e.stopPropagation(); setShowConfirm(true); }}
          className="text-xs font-semibold text-red-400 hover:text-red-600 transition-colors duration-150 whitespace-nowrap"
        >
          Clear All Data
        </button>
      ) : createPortal(
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setShowConfirm(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl px-6 py-6 max-w-sm w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-text-main mb-1">Clear All Data</h3>
            <p className="text-sm text-text-light mb-4">
              This will permanently delete all your transactions, budgets and notes from this device. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors"
              >
                Clear everything
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-text-light text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
