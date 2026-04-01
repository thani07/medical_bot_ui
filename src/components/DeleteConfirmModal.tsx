import Modal from './Modal';
import { useApp } from '../context/AppContext';

interface Props {
  open: boolean;
  title: string;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export default function DeleteConfirmModal({ open, title, onClose, onConfirm, loading }: Props) {
  const { theme } = useApp();
  const isLight = theme === 'light';

  return (
    <Modal open={open} onClose={onClose} title="Delete conversation">
      <div className="space-y-4">
        <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
          Are you sure you want to delete <strong className={`${isLight ? 'text-slate-900' : 'text-white'}`}>"{title}"</strong>? This action cannot be undone and all messages will be permanently lost.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className={`px-4 py-2 text-sm rounded-lg transition-colors
              ${isLight
                ? 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                : 'text-slate-400 hover:text-white hover:bg-dark-600'
              }`}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 text-sm bg-health-danger text-white rounded-lg hover:bg-red-600
              transition-colors disabled:opacity-50 font-medium"
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
