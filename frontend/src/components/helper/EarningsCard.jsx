import Card from '../ui/Card';

export default function EarningsCard({ title, value, subtitle }) {
  return (
    <Card className="shadow-lg">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="mt-2 text-2xl font-semibold text-gray-900">{value}</p>
      {subtitle && (
        <p className="mt-1 text-xs text-gray-500">{subtitle}</p>
      )}
    </Card>
  );
}

