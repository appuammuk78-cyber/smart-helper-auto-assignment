export default function Modal({ open, title, children, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-full max-w-md mx-4">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 animate-fade-in">
          {title && (
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            </div>
          )}
          <div>{children}</div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="mt-6 inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

