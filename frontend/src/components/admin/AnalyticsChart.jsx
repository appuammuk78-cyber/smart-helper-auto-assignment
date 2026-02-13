import Card from '../ui/Card';

export default function AnalyticsChart({ title, data, type = 'line' }) {
  // Mock chart visualization using CSS bars
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <Card className="shadow-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-3">
        {data.map((item, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <div className="w-20 text-xs text-gray-600 flex-shrink-0">
              {item.label}
            </div>
            <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              />
            </div>
            <div className="w-16 text-xs font-medium text-gray-900 text-right">
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
