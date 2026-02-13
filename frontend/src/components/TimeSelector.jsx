const OPTIONS = ['Now', 'In 1 hour', 'Schedule for later'];

export default function TimeSelector({
  value,
  onChange,
  scheduledDate,
  onScheduledDateChange,
}) {
  const showDatetime = value === 'Schedule for later';

  const handleSelect = (option) => {
    onChange(option);
    if (option !== 'Schedule for later') onScheduledDateChange('');
  };

  return (
    <div className="space-y-3">
      <select
        value={value}
        onChange={(e) => handleSelect(e.target.value)}
        className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pr-10"
        aria-label="Time option"
      >
        {OPTIONS.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>

      {showDatetime && (
        <div
          className="overflow-hidden animate-slide-down"
          role="region"
          aria-label="Schedule date and time"
        >
          <input
            type="datetime-local"
            value={scheduledDate}
            onChange={(e) => onScheduledDateChange(e.target.value)}
            min={new Date().toISOString().slice(0, 16)}
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-label="Date and time"
          />
        </div>
      )}
    </div>
  );
}
