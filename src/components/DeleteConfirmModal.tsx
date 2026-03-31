import Modal from './Modal';

interface Props {
  open: boolean;
  title: string;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export default function DeleteConfirmModal({ open, title, onClose, onConfirm, loading }: Props) {
  return (
    <Modal open={open} onClose={onClose} title="Delete conversation">
      <div className="space-y-4">
        <p className="text-sm text-slate-300">
          Are you sure you want to delete <strong className="text-white">"{title}"</strong>? This action cannot be undone and all messages will be permanently lost.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-400 hover:text-white rounded-lg hover:bg-dark-600 transition-colors"
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
