export default function Toast({ toast, onClose }) {
  return (
    <div className={`toast toast-${toast.type} animate-slide-in`} role="alert">
      <span className="toast-icon" aria-hidden="true">
        {toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : 'ℹ'}
      </span>
      <p>{toast.message}</p>
      <button type="button" className="toast-close" onClick={onClose} aria-label="Dismiss">
        ✕
      </button>
    </div>
  );
}
