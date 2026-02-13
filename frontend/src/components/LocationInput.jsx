import Loader from './ui/Loader';

export default function LocationInput({
  value,
  onChange,
  onDetect,
  detecting = false,
  placeholder = 'Enter your location',
}) {
  return (
    <div className="space-y-3">
      <div className="relative">
        <span
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          aria-hidden
        >
          📍
        </span>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          aria-label="Location"
        />
      </div>
      <button
        type="button"
        onClick={onDetect}
        disabled={detecting}
        className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 disabled:opacity-70 transition-opacity"
      >
        {detecting ? (
          <>
            <Loader size="sm" />
            <span>Detecting location...</span>
          </>
        ) : (
          <>
            <span aria-hidden>📍</span>
            <span>Auto-detect location</span>
          </>
        )}
      </button>
    </div>
  );
}
