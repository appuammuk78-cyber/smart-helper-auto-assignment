import Badge from '../ui/Badge';
import Button from '../ui/Button';

export default function StatusToggle({ status, onToggle }) {
  const isAvailable = status === 'Available';

  return (
    <div className="flex items-center gap-3">
      <Badge variant={isAvailable ? 'success' : 'default'} pulse={isAvailable}>
        <span
          className={`w-2 h-2 rounded-full ${
            isAvailable ? 'bg-emerald-500' : 'bg-red-500'
          }`}
        />
        {isAvailable ? 'Available' : 'Busy'}
      </Badge>
      <Button
        type="button"
        variant="ghost"
        className="px-3 py-1.5 text-xs border border-gray-200 rounded-full shadow-sm hover:shadow-md"
        onClick={onToggle}
      >
        Set {isAvailable ? 'Busy' : 'Available'}
      </Button>
    </div>
  );
}

